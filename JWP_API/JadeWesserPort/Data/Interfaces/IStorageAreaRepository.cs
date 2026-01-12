using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces
{
    public interface IStorageAreaRepository
    {
        Task<int> CreateAsync(StorageArea storageArea);
        Task<StorageArea?> FindByCodeAsync(string code);
        IQueryable<StorageArea> GetAllQueryable();
        Task UpdateAsync(StorageArea storageArea);
    }
}
