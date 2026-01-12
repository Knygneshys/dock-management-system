using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;

namespace JadeWesserPort.Services.Interfaces;
public interface IResourceService
{
    Task<IEnumerable<Resource>?> GetByFilterAsync(string? description, ResourceTypes? type, ResourceStatus? status);
}
