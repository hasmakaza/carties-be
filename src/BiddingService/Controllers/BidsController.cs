using AutoMapper;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using static BiddingService.Enum;

namespace BiddingService;
[ApiController]
[Route("api/bids")]
public class BidsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly GrpcAuctionClient _grpcAuctionClient;

    public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint, GrpcAuctionClient grpcAuctionClient)
    {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
        _grpcAuctionClient = grpcAuctionClient;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Bid>> PlaceBid(string auctionId, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);
        if (auction == null)
        {
            auction = _grpcAuctionClient.GetAuction(auctionId);
            if(auction == null) return BadRequest("Cannot accept bids on this auction at this time.");    
        }
        if(User == null || User.Identity == null || User.Identity.Name == null){
            return BadRequest("User must be login");
        }
        if (auction.Seller == User.Identity.Name)
        {
            return BadRequest("You cannot bid on your own auction.");
        }
        var bid = new Bid
        {
            AuctionId = auctionId,
            Amount = amount,
            Bidder = User.Identity.Name 
        };
        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }
        else
        {

            var highBid = await DB.Find<Bid>()
                .Match(a => a.AuctionId == auctionId)
                .Sort(b => b.Descending(x => x.Amount))
                .ExecuteFirstAsync();
            if (highBid != null && amount > highBid.Amount || highBid == null)
            {
                bid.BidStatus = amount > auction.ReservePrice
                ? BidStatus.Accepted
                : BidStatus.AcceptedBelowReserve;
            }
            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.BidStatus = BidStatus.TooLow;
            }
        }
        await DB.SaveAsync(bid);
        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));
        return Ok(_mapper.Map<BidDto>(bid));
    }
    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsForAuction(string auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(a => a.AuctionId == auctionId)
            .Sort(b => b.Descending(a => a.BidTime))
            .ExecuteAsync();
        if (!bids.Any())
        {
            return NotFound();
        }
        return Ok(bids.Select(_mapper.Map<BidDto>).ToList());
    }
}
