using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;
public class VVNRepository(JWPDbContext dbContext) : IVVNRepository
{
    public async Task<VesselVisitNotification?> GetByCodeAsync(int code)
    {
        return await dbContext.VesselVisitNotifications
            .Include(v => v.Vessel)
                .ThenInclude(v => v.Type)
            .Include(v => v.ShippingAgentRepresentative)
            .Include(v => v.CrewManifest)
            .Include(v => v.CargoUnloadManifest)
                .ThenInclude(cm => cm.CargoItems)
            .Include(v => v.CargoLoadManifest)
                .ThenInclude(cm => cm.CargoItems)
            .FirstOrDefaultAsync(v => v.Code.Equals(code));
    }

    public async Task<List<VesselVisitNotification>> GetAllAsync()
    {
        return await dbContext.VesselVisitNotifications
            .Include(v => v.Vessel)
                .ThenInclude(v => v.Owner)
            .Include(v => v.Vessel)
                .ThenInclude(v => v.Operator)
            .Include(v => v.ShippingAgentRepresentative)
                .ThenInclude(sar => sar.Company)
            .Include(v => v.CrewManifest)
            .Include(v => v.CargoUnloadManifest)
                .ThenInclude(unloadManifest => unloadManifest.CargoItems)
            .Include(v => v.CargoLoadManifest)
                .ThenInclude(loadManifest => loadManifest.CargoItems)
            .ToListAsync();
    }

    public async Task<int> CreateAsync(VesselVisitNotification notification)
    {
        await dbContext.VesselVisitNotifications.AddAsync(notification);
        await dbContext.SaveChangesAsync();
        return notification.Code;
    }
      
    public async Task<CrewMember?> FindCrewMemberByCIDAsync(int cid)
    {
        return await dbContext.VesselVisitNotifications
            .SelectMany(vvn => vvn.CrewManifest)
            .FirstOrDefaultAsync(crewMember => crewMember.CitizenshipId.Equals(cid));
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }

    public async Task<List<VesselVisitNotification>> GetOverlappingAsync(DateTime start, DateTime end)
    {
        return await dbContext.VesselVisitNotifications
            .Include(v => v.Vessel)
                .ThenInclude(v => v.Owner)
            .Include(v => v.Vessel)
                .ThenInclude(v => v.Operator)
            .Include(v => v.ShippingAgentRepresentative)
                .ThenInclude(sar => sar.Company)
            .Include(v => v.CrewManifest)
            .Include(v => v.CargoUnloadManifest)
                .ThenInclude(m => m.CargoItems)
            .Include(v => v.CargoLoadManifest)
                .ThenInclude(m => m.CargoItems)
            .Include(v => v.Dock)
                .ThenInclude(dock => dock.STSCranes)
                    .ThenInclude(cranes => cranes.Qualifications)
            .Where(v => v.Status.Equals(VVNStatus.Approved))
            .Where(v => v.Eta < end && v.Etd > start)
            .ToListAsync();
    }
}


