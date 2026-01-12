using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces;

public interface IDockRecordRepository
{
    Task<string> CreateAsync(DockRecord dockRecord);
    Task<DockRecord?> FindByCodeAsync(string code);
    Task<List<DockRecord>> GetAllAsync();
    Task<List<VesselType>> GetVesselTypesByCodeAsync(List<string> codes);
    Task SaveChangesAsync();
    IQueryable<DockRecord> GetAllQueryable();
}