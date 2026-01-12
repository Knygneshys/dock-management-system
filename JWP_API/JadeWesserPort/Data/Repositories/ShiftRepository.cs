using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class ShiftRepository(JWPDbContext dbContext) : IShiftRepository
{
    public async Task<bool> CreateAsync(Shift shift)
    {
        await dbContext.Shifts.AddAsync(shift);
        await dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<List<Shift>> GetByResourceAsync(Resource resource)
    {
        return await dbContext.Shifts
            .Where(e => e.Resource.Id.Equals(resource.Id))
            .Include(e => e.StaffMember)
            .ToListAsync();
    }

    public async Task<List<Shift>> GetByStaffAsync(StaffMember staff)
    {
        return await dbContext.Shifts
            .Where(e => e.StaffMember.Id.Equals(staff.Id))
            .Include(e => e.Resource)
            .ToListAsync();
    }

    public IQueryable<Shift> GetAllQueryable()
    {
        return dbContext.Shifts.AsQueryable();
    }

    public async Task<List<Shift>> GetAllAsync()
    {
        return await dbContext.Shifts
            .Include(s=>s.Resource)
            .Include(s=>s.StaffMember)
            .Where(s=> s.StaffMember.isActive)
            .ToListAsync();
    }
}
