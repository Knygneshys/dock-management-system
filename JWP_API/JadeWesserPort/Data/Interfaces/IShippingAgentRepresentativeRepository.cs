using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;

namespace JadeWesserPort.Data.Interfaces;

public interface IShippingAgentRepresentativeRepository
{
    public Task<string> CreateAsync(ShippingAgentRepresentative rep);
    public Task<List<ShippingAgentRepresentative>> GetAllAsync();
    public Task<bool> ExistsByEmailAsync(string email);
    public Task<ShippingAgentRepresentative?> GetByEmailAsync(string email);
    public Task<List<VesselVisitNotification>> GetSARVVNsBySAREmailAsync(string email);
}