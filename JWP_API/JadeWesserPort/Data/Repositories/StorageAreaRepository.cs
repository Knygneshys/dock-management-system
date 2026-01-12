using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories
{
    public class StorageAreaRepository(JWPDbContext context) : IStorageAreaRepository
    {
        public async Task<int> CreateAsync(StorageArea storageArea)
        {
            await context.StorageAreas.AddAsync(storageArea);
            await context.SaveChangesAsync();
            return 1;
        }

        public async Task<StorageArea?> FindByCodeAsync(string code)
        {
            return await context.StorageAreas
                .FirstOrDefaultAsync(sa => sa.Code == code);
        }

        public IQueryable<StorageArea> GetAllQueryable() => context.StorageAreas.Include(e => e.YardCranes).AsQueryable();
        
        public async Task UpdateAsync(StorageArea storageArea)
        {
            context.StorageAreas.Update(storageArea);
            await context.SaveChangesAsync();
        }

    }
}