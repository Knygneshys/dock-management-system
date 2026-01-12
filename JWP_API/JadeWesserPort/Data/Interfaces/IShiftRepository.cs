using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Data.Interfaces;

public interface IShiftRepository
{
    Task<bool> CreateAsync(Shift shift);
    Task<List<Shift>> GetByResourceAsync(Resource resource);
    Task<List<Shift>> GetByStaffAsync(StaffMember staff);
    IQueryable<Shift> GetAllQueryable();
    Task<List<Shift>> GetAllAsync();
}
