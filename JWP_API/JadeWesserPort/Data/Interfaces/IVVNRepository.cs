using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces;

public interface IVVNRepository
{
    Task<VesselVisitNotification?> GetByCodeAsync(int code);
    Task<List<VesselVisitNotification>> GetAllAsync();
    Task<int> CreateAsync(VesselVisitNotification notification);
    Task SaveChangesAsync();
    Task<CrewMember?> FindCrewMemberByCIDAsync(int cid);
    Task<List<VesselVisitNotification>> GetOverlappingAsync(DateTime start, DateTime end);
}