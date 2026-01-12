using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class VesselSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.Vessels.AnyAsync())
        {
            return;
        }

        var vessels = GetVessels(_dbContext).Result;

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
    }
    private static async Task<IEnumerable<Vessel>> GetVessels(JWPDbContext _dbContext)
    {
        var companies = await _dbContext.Companies.ToListAsync();
        var types = await _dbContext.VesselTypes.ToListAsync();

        return
        [
            new Vessel()
            {
                Imo = "IMO 1234567",
                Name = "Evergreen Express",
                Owner = companies[0],
                Operator = companies[1],
                Type = types[0]
            },
            new Vessel()
            {
                Imo = "IMO 8814275",
                Name = "Vessel 2",
                Owner = companies[0],
                Operator = companies[2],
                Type = types[1]
            },
            new Vessel()
            {
                Imo = "IMO 9883417",
                Name = "Evergreen Express",
                Owner = companies[0],
                Operator = companies[1],
                Type = types[2]
            }
        ];
    }
}
