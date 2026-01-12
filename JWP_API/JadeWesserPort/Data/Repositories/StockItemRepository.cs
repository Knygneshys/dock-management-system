using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class StockItemRepository(JWPDbContext dbContext) : IStockItemsRepository
{
    public async Task<string> CreateAsync(StockItem item)
    {
        await dbContext.StockItems.AddAsync(item);
        await dbContext.SaveChangesAsync();

        return item.ContainerISO;
    }

    public bool Delete(StockItem item)
    {
        dbContext.StockItems.Remove(item);
        return true;
    }

    public IQueryable<StockItem> GetAllQueryable()
    {
        return dbContext.StockItems.AsQueryable()
            .Include(e => e.StorageArea);
    }

    public async Task<StockItem?> GetByIsoAsync(string iso)
    {
        return await dbContext.StockItems
            .Include(e => e.StorageArea)
            .FirstOrDefaultAsync(e => e.ContainerISO.Equals(iso));
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }
}
