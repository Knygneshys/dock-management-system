using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class StaffRepository(JWPDbContext dbContext) : IStaffRepository
{
    public async Task<int> CreateAsync(StaffMember staffMember)
    {
        await dbContext.StaffMembers.AddAsync(staffMember);
        await dbContext.SaveChangesAsync();
        
        return staffMember.MecanographicNumber;
    }

    public async Task<StaffMember?> GetByIdAsync(int id)
    {
        return await dbContext.StaffMembers
            .Include(e => e.Qualifications)
            .Include(e => e.OperationalWindows)
            .Include(e => e.Shifts)
            .FirstOrDefaultAsync(e => e.MecanographicNumber.Equals(id));
    }

    public async Task<List<StaffMember>> GetAllAsync()
    {
        return await dbContext.StaffMembers
            .Include(e => e.Qualifications)
            .Include(e => e.OperationalWindows)
            .Include(e => e.Shifts)
            .ToListAsync();
    }

    public async Task<List<OperationalWindow>> GetStaffOperationalWindowsAsync(int mNumber)
    {
        var staff = await dbContext.StaffMembers.FirstOrDefaultAsync(q => q.MecanographicNumber.Equals(mNumber));

        if (staff is null)
        {
            throw new KeyNotFoundException($"Staff with mechanografic number {mNumber} not found!");
        }
        return await dbContext.OperationalWindows
            .Where(e => e.StaffMemberId.Equals(staff.Id))
            .ToListAsync();
    }
    
    public IQueryable<StaffMember> GetAllQueryable()
    {
        return dbContext.StaffMembers.AsQueryable();
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }
}