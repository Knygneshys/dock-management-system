using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Services.Interfaces;

public interface IDockAvailabilityService
{
    Task<DockRecord?> FindAvailableDockAsync(Guid vesselTypeId, DateTime eta, DateTime etd);

}