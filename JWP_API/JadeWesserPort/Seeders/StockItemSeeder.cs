using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class StockItemSeeder (JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if(await _dbContext.StockItems.AnyAsync())
        {
            return;
        }

        var stockItems = await GetStockItems(_dbContext);

        await _dbContext.StockItems.AddRangeAsync(stockItems);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<StockItem>> GetStockItems(JWPDbContext _dbContext)
    {
        var storageAreas = await _dbContext.StorageAreas.ToListAsync();
        return
        [
            new() {
                ContainerISO = "ISO1234567",
                Description = "Electronics",
                From = "Shanghai",
                To = "Los Angeles",
                AvailableSince = DateTime.UtcNow.AddDays(-10),
                AvailableUntil = DateTime.UtcNow.AddDays(20),
                StorageAreaId = storageAreas[0].Id
            },
            new() {
                ContainerISO = "ISO7654321",
                Description = "Furniture",
                From = "Hamburg",
                To = "New York",
                AvailableSince = DateTime.UtcNow.AddDays(-5),
                AvailableUntil = DateTime.UtcNow.AddDays(15),
                StorageAreaId = storageAreas[1].Id
            }
        ];
    }
}
