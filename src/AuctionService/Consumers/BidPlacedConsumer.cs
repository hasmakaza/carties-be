using Contracts;
using MassTransit;

namespace AuctionService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbcontext _dbContext;

    public BidPlacedConsumer(AuctionDbcontext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
       Console.WriteLine("--> Consuming bid placed");
       var auction = await _dbContext.Auctions.FindAsync(context.Message.AuctionId);
       if(auction is null) return;
       if(auction.CurrentHighBid == null 
       || context.Message.BidStatus.Contains("Accepted") 
       && context.Message.Amount > auction.CurrentHighBid)
       {
           auction.CurrentHighBid = context.Message.Amount;
           await _dbContext.SaveChangesAsync();
       }
    }
}
