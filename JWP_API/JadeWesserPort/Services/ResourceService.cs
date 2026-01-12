using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;
public class ResourceService(IResourceRepository resourceRepository) : IResourceService
{
    public async Task<IEnumerable<Resource>?> GetByFilterAsync(string? description, ResourceTypes? type, ResourceStatus? status)
    {
        if(string.IsNullOrEmpty(description) && type is null && status is null)
        {
            return await resourceRepository.GetAllAssync();
        }

        IQueryable<Resource> query = resourceRepository.GetAllQueryable()
            .Include(resource => resource.Qualifications);

        if(!string.IsNullOrEmpty(description))
        {
            description = description.ToUpper();
            query = query.Where(resource => resource.Description.ToUpper().Contains(description));
        }

        if(type != null)
        {
            query = type switch
            {
                ResourceTypes.STSCrane => query.Where(resource => resource is STSCrane),
                ResourceTypes.YardCrane => query.Where(resource => resource is YardCrane),
                ResourceTypes.TerminalTruck => query.Where(resource => resource is TerminalTruck),
                _ => throw new ArgumentException($"Unsupported resource type: {type}")
            };
        }

        if(status != null)
        {
            query = query.Where(resource => resource.Status.Equals(status));
        }

        return await query.ToListAsync();
    }
}
