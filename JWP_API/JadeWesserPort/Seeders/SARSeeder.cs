using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class SARSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if(await _dbContext.ShippingAgentRepresentatives.AnyAsync())
        {
            return;
        }

        var sar = await GetShippingAgentRepresentatives(_dbContext);

        await _dbContext.ShippingAgentRepresentatives.AddRangeAsync(sar);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<ShippingAgentRepresentative>> GetShippingAgentRepresentatives(JWPDbContext _dbContext)
    {
        var users = await _dbContext.Users.ToListAsync();
        var company = await _dbContext.Companies.FirstAsync();

        List<ShippingAgentRepresentative> sarList = [];

        foreach (var user in users)
        {
            if(user.Role.Equals(UserRole.ShippingAgentRepresentative))
            {
                var sar = new ShippingAgentRepresentative()
                {
                    Name = $"SAR {user.Email.Split('@')[0]}",
                    Company = company,
                    User = user
                };
                sarList.Add(sar);
            }
        }

        return sarList;
    }
}
