using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces
{
    public interface IDockStorageDistanceRepository
    {
        Task<int> CreateAsync(DockStorageDistance entity);
        Task<int> UpdateAsync(DockStorageDistance entity);
        Task<DockStorageDistance?> FindByCodeAsync(string code);
        IQueryable<DockStorageDistance> GetAllQueryable();
    }
}