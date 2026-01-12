using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.System;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories
{
    public class DataRectificationRequestRepository : IDataRectificationRequestRepository
    {
        private readonly JWPDbContext dbContext;
        public DataRectificationRequestRepository(JWPDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task CreateAsync(DataRectificationRequest request)
        {
            await dbContext.DataRectificationRequests.AddAsync(request);
            await dbContext.SaveChangesAsync();
        }
        public async Task<List<DataRectificationRequest>> GetPendingAsync()
        {
            return await dbContext.DataRectificationRequests.Where(r => r.Status == "Pendente").ToListAsync();
        }
        public async Task<DataRectificationRequest?> GetByIdAsync(Guid id)
        {
            return await dbContext.DataRectificationRequests.FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task UpdateAsync(DataRectificationRequest request)
        {
            dbContext.DataRectificationRequests.Update(request);
            await dbContext.SaveChangesAsync();
        }
    }
}
