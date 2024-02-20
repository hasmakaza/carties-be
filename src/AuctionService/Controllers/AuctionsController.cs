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

    private readonly IAuctionRepository _dbContext;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publisheEndpoint;

    public AuctionsController(IAuctionRepository dbContext, IMapper mapper, IPublishEndpoint publisheEndpoint)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _publisheEndpoint = publisheEndpoint;
    }
    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(string? date)
    {
        return await _dbContext.GetAuctionAsync(date);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _dbContext.GetAuctionByIdAsync(id);
        if (auction == null)
        {
            return NotFound();
        }
        return auction;
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
        _dbContext.AddAuction(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publisheEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _dbContext.SaveChangesAsync();

        if (!result) return BadRequest();

        return CreatedAtAction(nameof(GetAuctionById), new { id = auction.Id }, newAuction);
    }
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<AuctionDto>> UpdateAuction([FromRoute] Guid id, [FromBody] UpdateAuctionDto updateAuctionDto)
    {
        var auction = await _dbContext.GetAuctionEntityByIdAsync(id);
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
        var result = await _dbContext.SaveChangesAsync();
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
        var auction = await _dbContext.GetAuctionEntityByIdAsync(id);
        if (auction == null)
        {
            return NotFound();
        }
        if (User.Identity is not null && auction.Seller != User.Identity.Name) return Forbid();
        _dbContext.RemoveAuction(auction);
        await _publisheEndpoint.Publish<AuctionDeleted>(new { Id = auction.Id.ToString() });
        var result = await _dbContext.SaveChangesAsync();
        if (!result)
        {
            return BadRequest("Problem saving change");
        }
        return Ok();
    }
}
