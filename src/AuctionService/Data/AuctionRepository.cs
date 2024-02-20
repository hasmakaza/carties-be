using AuctionService.DTOS;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace AuctionService;

public class AuctionRepository : IAuctionRepository
{
    private readonly AuctionDbcontext _dbContext;
    private readonly IMapper _mapper;

    public AuctionRepository(AuctionDbcontext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public void AddAuction(Auction auction)
    {
        _dbContext.Add(auction);
    }

    public async Task<List<AuctionDto>> GetAuctionAsync(string? date)
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

    public async Task<AuctionDto?> GetAuctionByIdAsync(Guid id)
    {
        return await _dbContext.Auctions
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Auction?> GetAuctionEntityByIdAsync(Guid id)
    {
        return await _dbContext.Auctions
                .Include(x => x.Item)
                .FirstOrDefaultAsync(x => x.Id == id);
    }

    public void RemoveAuction(Auction auction)
    {
        _dbContext.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _dbContext.SaveChangesAsync() > 0;
    }
}
