using AuctionService.DTOS;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService;
[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{

    private readonly AuctionDbcontext _dbContext;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publisheEndpoint;

    public AuctionsController(AuctionDbcontext dbContext, IMapper mapper, IPublishEndpoint publisheEndpoint)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _publisheEndpoint = publisheEndpoint;
    }
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string? date)
    {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        var query = _dbContext.Auctions.OrderBy(_ => _.Item.Make).AsQueryable();
#pragma warning restore CS8602 // Dereference of a possibly null reference.

        if (!string.IsNullOrEmpty(date))
        {
            query = query.Where(x => x.UpdatedAt.CompareTo(DateTime.Parse(date).ToUniversalTime()) > 0);
        }
        return await query.ProjectTo<AuctionDto>(_mapper.ConfigurationProvider).ToListAsync();
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var result = await _dbContext.Auctions
                    .Include(c => c.Item)
                    .SingleOrDefaultAsync(x => x.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(_mapper.Map<AuctionDto>(result));
    }
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
    {
        var auction = _mapper.Map<Auction>(createAuctionDto);
        if (User.Identity is not null)
        {
            auction.Seller = User.Identity.Name;
        }
        _dbContext.Add(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publisheEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _dbContext.SaveChangesAsync() > 0;

        if (!result) return BadRequest();

        return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, newAuction);
    }
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<AuctionDto>> UpdateAuction([FromRoute] Guid id, [FromBody] UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _dbContext.Auctions
                            .Include(a => a.Item)
                            .FirstOrDefaultAsync(a => a.Id == id);
        if (auction == null)
        {
            return NotFound();
        }
        if (User.Identity is not null && auction.Seller != User.Identity.Name) return Forbid();
        if (auction.Item is not null)
        {
            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
        }
        await _publisheEndpoint.Publish(_mapper.Map<AuctionUpdated>(auction));
        _dbContext.Update(auction);
        var result = await _dbContext.SaveChangesAsync() > 0;
        if (!result)
        {
            return BadRequest("Problem saving change");
        }
        return Ok();
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _dbContext.Auctions.FindAsync(id);
        if (auction == null)
        {
            return NotFound();
        }
        if (User.Identity is not null && auction.Seller != User.Identity.Name) return Forbid();
        _dbContext.Remove(auction);
        await _publisheEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });
        var result = await _dbContext.SaveChangesAsync() > 0;
        if (!result)
        {
            return BadRequest("Problem saving change");
        }
        return Ok();
    }
}
