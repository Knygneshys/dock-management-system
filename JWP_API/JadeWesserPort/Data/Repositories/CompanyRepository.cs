using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class CompanyRepository(JWPDbContext dbContext) : ICompanyRepository
{
    public async Task<string> CreateAsync(Company company)
    {
        await dbContext.AddAsync(company);
        await dbContext.SaveChangesAsync();

        return company.Code;
    }

    public async Task<Company?> GetByCodeAsync(string code)
    {
        return await dbContext.Companies.FirstOrDefaultAsync(company => company.Code.Equals(code));
    }

    public async Task<bool> ExistsAsync(string code)
    {
        return await dbContext.Companies.AnyAsync(company => company.Code.Equals(code));
    }

    public async Task<List<Company>> GetAllAsync()
    {
        return await dbContext.Companies.ToListAsync();
    }
}