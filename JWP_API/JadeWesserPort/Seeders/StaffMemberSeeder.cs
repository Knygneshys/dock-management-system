using JadeWesserPort.Data;
using JadeWesserPort.Domain;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class StaffMemberSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.StaffMembers.AnyAsync())
        {
            return;
        }

        var staffs = await GetStaffsAsync(_dbContext);

        await _dbContext.StaffMembers.AddRangeAsync(staffs);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<StaffMember>> GetStaffsAsync(JWPDbContext _dbContext)
    {
        var qualifications = await _dbContext.Qualifications.ToListAsync();
        var s1 = new StaffMember()
        {
            Id = Guid.NewGuid(),
            MecanographicNumber = 10000,
            Name = "John STS Crane",
            Email = "john@email.com",
            Phone = 90913091,
            Status = StaffStatus.Available
        };
        s1.Qualifications.Add(qualifications[0]);

        var s2 = new StaffMember()
        {
            Id = Guid.NewGuid(),
            MecanographicNumber = 10001,
            Name = "Michael Truck Guy",
            Email = "michael@email.com",
            Phone = 23532613,
            Status = StaffStatus.Available
        };
        s2.Qualifications.Add(qualifications[1]);

        var s3 = new StaffMember()
        {
            Id = Guid.NewGuid(),
            MecanographicNumber = 10002,
            Name = "Maria Yard Crane",
            Email = "maria@email.com",
            Phone = 3523652,
            Status = StaffStatus.Available
        };
        s3.Qualifications.Add(qualifications[2]);

        return [s1, s2, s3];
    }
}
