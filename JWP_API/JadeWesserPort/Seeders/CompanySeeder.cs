using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class CompanySeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if(await _dbContext.Companies.AnyAsync())
        {
            return;
        }

        var companies = GetCompanies();

        await _dbContext.Companies.AddRangeAsync(companies);
        await _dbContext.SaveChangesAsync();
    }

    private static IEnumerable<Company> GetCompanies()
    {
        return
        [
            new Company()
            {
                Id = Guid.NewGuid(),
                Code = "COMP001",
                Name = "Global Shipping Co."
            },
            new Company()
            {
                Id = Guid.NewGuid(),
                Code = "COMP002",
                Name = "Oceanic Logistics Ltd."
            },
            new Company()
            {
                Id = Guid.NewGuid(),
                Code = "COMP003",
                Name = "Maritime Transport Inc."
            }
        ];
    }
}
