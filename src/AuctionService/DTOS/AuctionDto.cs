namespace AuctionService.DTOS;

public class AuctionDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime AuctionEnd { get; set; }
    public required string Seller { get; set; }
    public required string Winners { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public int Year { get; set; }
    public required string Color { get; set; }
    public int Mileage { get; set; }
    public required string ImageUrl { get; set; }
    public required string Status { get; set; }
    public int ReservePrice { get; set; }
    public int SoldAmount { get; set; }
    public int CurrentHighBid { get; set; }
}
