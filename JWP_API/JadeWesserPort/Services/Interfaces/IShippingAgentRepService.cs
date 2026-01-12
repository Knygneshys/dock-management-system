using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface IShippingAgentRepService
{
    public Task<string> CreateAsync(ShippingAgentRepresentativeDTO dto);
    public Task<List<ShippingAgentRepresentative>> GetAllAsync();
    public Task<List<VVNDto>> GetSARVVNsAsync(string email);
}