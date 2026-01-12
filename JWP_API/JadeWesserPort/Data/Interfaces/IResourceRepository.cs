using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.ResourceDTOs;

namespace JadeWesserPort.Data.Interfaces
{
    public interface IResourceRepository
    {
        Task<string> CreateAsync(Resource resource);
        Task<Resource?> FindByCodeAsync(string code);
        Task<IEnumerable<Resource>> GetAllAssync();
        Task<Resource?> UpdateAsync(string code, ResourceUpdateDTO resourceDTO);
        Task<Resource?> UpdateStatusAsync(string code, ResourceStatus status);
        IQueryable<Resource> GetAllQueryable();
    }
}
