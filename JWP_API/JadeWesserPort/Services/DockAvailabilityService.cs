using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;

public class DockAvailabilityService : IDockAvailabilityService
{
    private readonly IDockRecordRepository _dockRepository;

    public DockAvailabilityService(IDockRecordRepository dockRepository)
    {
        _dockRepository = dockRepository;
    }

    public async Task<DockRecord?> FindAvailableDockAsync(Guid vesselTypeId, DateTime eta, DateTime etd)
    {
        var compatibleDocks = await _dockRepository.GetAllQueryable()
            .Where(d => d.AllowedVesselTypes.Any(vt => vt.Id.Equals(vesselTypeId)))
            .ToListAsync();

        foreach (var dock in compatibleDocks)
        {
            bool hasConflict = dock.Visits.Any(visit =>
                (eta >= visit.Eta && eta < visit.Etd) ||
                (etd > visit.Eta && etd <= visit.Etd) ||
                (eta <= visit.Eta && etd >= visit.Etd)
            );

            if (!hasConflict)
            {
                return dock;
            }
        }

        return null;
    }
}