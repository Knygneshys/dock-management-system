using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class QualificationSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if(await _dbContext.Qualifications.AnyAsync())
        {
            return;
        }
        
        var qualifications = GetQualifications();

        await _dbContext.Qualifications.AddRangeAsync(qualifications);
        await _dbContext.SaveChangesAsync();
    }

    private static IEnumerable<Qualification> GetQualifications()
    {
        return
        [
            new Qualification()
            {
                Id = Guid.NewGuid(),
                Code = "L-STS",
                Name = "STS Crane Operator"
            },
            new Qualification()
            {
                Id = Guid.NewGuid(),
                Code = "L-TRK",
                Name = "Terminal Truck Operator"
            },
            new Qualification()
            {
                Id = Guid.NewGuid(),
                Code = "L-YC",
                Name = "Yard Crane Operator"
            }
        ];
    }
}
