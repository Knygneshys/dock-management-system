using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces;

public interface IStockItemsRepository
{
    Task<string> CreateAsync(StockItem item);
    Task<StockItem?> GetByIsoAsync(string iso);
    IQueryable<StockItem> GetAllQueryable();
    bool Delete(StockItem item);
    Task SaveChangesAsync();
}
