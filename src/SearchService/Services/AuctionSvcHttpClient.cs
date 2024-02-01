using Microsoft.AspNetCore.Http.HttpResults;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Services;

public class AuctionSvcHttpClient
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public AuctionSvcHttpClient(IConfiguration configuration, HttpClient httpClient)
    {
        _configuration = configuration;
        _httpClient = httpClient;
    }
    public async Task<List<Item>?> GetItemsForSearchDb()
    {
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(_ => _.Descending(_ => _.UpdatedAt))
            .Project(_ => _.UpdatedAt.ToString())
            .ExecuteFirstAsync();
        return await _httpClient.GetFromJsonAsync<List<Item>>(_configuration["AuctionServiceUrl"] 
            + "/api/auctions?date=" + lastUpdated);
    }
}
