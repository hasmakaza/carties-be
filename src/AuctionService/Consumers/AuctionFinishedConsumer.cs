using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly AuctionDbcontext _dbContext;

    public AuctionFinishedConsumer(AuctionDbcontext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("--> Consuming auction finished");
        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionId));
        if(auction is null) return;
        if(context.Message.ItemSold){
            auction.Winners = context.Message.Winner;
            auction.SoldAmount = context.Message.Amount;
        }
        auction.Status = auction.SoldAmount > auction.ReservePrice
            ? Enum.Status.Finished : Enum.Status.ReserveNotMet;
        await _dbContext.SaveChangesAsync();
    }
}
