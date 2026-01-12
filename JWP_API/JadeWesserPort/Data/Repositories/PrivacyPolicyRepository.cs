using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class PrivacyPolicyRepository(JWPDbContext _dbContext) : IPrivacyPolicyRepository
{
    public async Task<int> CreateAsync(PrivacyPolicy privacyPolicy)
    {
        await _dbContext.PrivacyPolicies.AddAsync(privacyPolicy);
        await _dbContext.SaveChangesAsync();

        return privacyPolicy.Version;
    }

    public async Task<List<PrivacyPolicy>> GetAllAsync()
    {
        return await _dbContext.PrivacyPolicies
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetCurrentVersion()
    {
        if (await _dbContext.PrivacyPolicies.AnyAsync())
        {
            return await _dbContext.PrivacyPolicies.MaxAsync(pp => pp.Version);
        }

        return 0;
    }

    public async Task<PrivacyPolicy?> GetNewestPolicy()
    {
        return await _dbContext.PrivacyPolicies
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();
    }
}