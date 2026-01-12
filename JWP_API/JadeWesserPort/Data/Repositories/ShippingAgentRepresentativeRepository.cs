using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class ShippingAgentRepresentativeRepository(JWPDbContext dbContext) : IShippingAgentRepresentativeRepository
{
    public async Task<string> CreateAsync(ShippingAgentRepresentative rep)
    {
        await dbContext.ShippingAgentRepresentatives.AddAsync(rep);
        await dbContext.SaveChangesAsync();
        return rep.User.Email;
    }

    public async Task<List<ShippingAgentRepresentative>> GetAllAsync()
    {
        return await dbContext.ShippingAgentRepresentatives
            .Include(r => r.Company)
            .Include(e => e.User)
            .ToListAsync();
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await dbContext.ShippingAgentRepresentatives
            .AnyAsync(r => r.User.Email.Equals(email));
    }

    public async Task<ShippingAgentRepresentative?> GetByEmailAsync(string email)
    {
        return await dbContext.ShippingAgentRepresentatives
            .Include(r => r.Company)
            .Include(r => r.User)
            .SingleOrDefaultAsync(r => r.User.Email.Equals(email));
    }

    public async Task<List<VesselVisitNotification>> GetSARVVNsBySAREmailAsync(string email)
    {
        var sar = await dbContext.ShippingAgentRepresentatives
            .Include(e => e.User)
            .Include(e => e.VesselVisitNotifications)
                .ThenInclude(vvn => vvn.Vessel)
            .FirstOrDefaultAsync(e => e.User.Email.Equals(email)) 
            ?? throw new KeyNotFoundException($"SAR with email {email} not found!");

        return sar.VesselVisitNotifications;
    }
}