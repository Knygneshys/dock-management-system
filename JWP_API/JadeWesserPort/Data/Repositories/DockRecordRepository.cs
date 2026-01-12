using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class DockRecordRepository(JWPDbContext dbContext) : IDockRecordRepository
{
    public async Task<string> CreateAsync(DockRecord dockRecord)
    {
        await dbContext.DockRecords.AddAsync(dockRecord);
        await dbContext.SaveChangesAsync();

        return dockRecord.Code;
    }

    public async Task<DockRecord?> FindByCodeAsync(string code)
    {
        return await dbContext.DockRecords
            .Include(e => e.AllowedVesselTypes)
            .Include(e => e.Visits)
            .FirstOrDefaultAsync(dockRecord => dockRecord.Code.Equals(code));
    }  
    public async Task<List<DockRecord>> GetAllAsync()
    {
        return await dbContext.DockRecords
            .Include(e => e.AllowedVesselTypes)
            .Include(e => e.Visits)
            .Include(e => e.STSCranes)
            .ToListAsync();
    }
    
    public async Task<List<VesselType>> GetVesselTypesByCodeAsync(List<string> codes)
    {
        return await dbContext.VesselTypes
            .Where(v => codes.Contains(v.Code))
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }
    public IQueryable<DockRecord> GetAllQueryable()
    {
        return dbContext.DockRecords
            .Include(e => e.AllowedVesselTypes)
            .Include(e => e.Visits)
            .AsQueryable();
    }

}

