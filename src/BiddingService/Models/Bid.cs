using MongoDB.Entities;
using static BiddingService.Enum;

namespace BiddingService;

public class Bid:Entity
{
    public required string AuctionId { get; set; }
    public DateTime BidTime {get;set;} = DateTime.UtcNow;
    public int Amount { get; set; }
    public required string Bidder { get; set; }
    public BidStatus BidStatus { get; set; }
}
