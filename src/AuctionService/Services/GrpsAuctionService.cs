using Grpc.Core;

namespace AuctionService.Services;

public class GrpsAuctionService : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbcontext _dbContext;

    public GrpsAuctionService(AuctionDbcontext dbContext)
    {
        _dbContext = dbContext;
    }

    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        Console.WriteLine("==> Received Grpc request for auction");
        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id))
                    ??  throw new RpcException(new Status(StatusCode.NotFound, "No Found"));
        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller
            }
        };
        return response;
    }
}