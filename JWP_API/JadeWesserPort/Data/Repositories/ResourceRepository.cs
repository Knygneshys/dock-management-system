using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.ResourceDTOs;
using JadeWesserPort.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories
{
    public class ResourceRepository(JWPDbContext dbContext) : IResourceRepository
    {
        public async Task<string> CreateAsync(Resource resource)
        {
            await dbContext.Resources.AddAsync(resource);
            await dbContext.SaveChangesAsync();

            return resource.AlphanumericCode;
        }

        public async Task<Resource?> FindByCodeAsync(string code)
        {
            Resource? resource = await dbContext.Resources
                .Include(r => r.Qualifications)
                .FirstOrDefaultAsync(r => r.AlphanumericCode.Equals(code));
            return resource;
        }

        public async Task<IEnumerable<Resource>> GetAllAssync()
        {
            return await dbContext.Resources
                .Include(r => r.Qualifications)
                .ToListAsync();
        }

        public IQueryable<Resource> GetAllQueryable()
        {
            return dbContext.Resources.AsQueryable();
        }

        public async Task<Resource?> UpdateAsync(string code, ResourceUpdateDTO resourceDTO)
        {
            Resource? existingResource = await FindByCodeAsync(code);

            if (existingResource is null)
            {
                throw new KeyNotFoundException($"Resource with code {code} not found.");
            }

            existingResource = ResourceExtensions.ToResource(resourceDTO, existingResource.Qualifications, existingResource);

            await dbContext.SaveChangesAsync();
            return existingResource;
        }

        public async Task<Resource?> UpdateStatusAsync(string code, ResourceStatus status)
        {
            Resource? existingResource = await FindByCodeAsync(code);
            if (existingResource is null)
            {
                throw new KeyNotFoundException($"Resource with code {code} not found.");
            }
            existingResource.Status = status;
            await dbContext.SaveChangesAsync();
            return existingResource;
        }
    }
}
