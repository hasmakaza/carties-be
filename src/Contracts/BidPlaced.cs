namespace Contracts;

public class BidPlaced
{
    public required string Id { get; set; }
    public required string AuctionId { get; set; }
    public required string Bidder { get; set; }
    public required DateTime BidTime { get; set; }
    public int Amount { get; set; }
    public required string BidStatus { get; set; }
}
