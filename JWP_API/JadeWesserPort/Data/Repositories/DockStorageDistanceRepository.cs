using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories
{
    public class DockStorageDistanceRepository(JWPDbContext context) : IDockStorageDistanceRepository
    {
        public async Task<int> CreateAsync(DockStorageDistance entity)
        {
            await context.DockStorageDistances.AddAsync(entity);
            await context.SaveChangesAsync();
            return 1;
        }

        public async Task<int> UpdateAsync(DockStorageDistance entity)
        {
            context.DockStorageDistances.Update(entity);
            await context.SaveChangesAsync();
            return 1;
        }

        public async Task<DockStorageDistance?> FindByCodeAsync(string code)
        {
            return await context.DockStorageDistances
                .FirstOrDefaultAsync(d => d.Code == code);
        }

        public IQueryable<DockStorageDistance> GetAllQueryable()
        {
            return context.DockStorageDistances
                .AsNoTracking()
                .Include(d => d.DockRecord)
                .Include(d => d.StorageArea)
                .AsQueryable();
        }
    }
}
