using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;

namespace JadeWesserPort.Services;

public class ShippingAgentRepService(
    IShippingAgentRepresentativeRepository representativeRepository, 
    ICompanyRepository companyRepository,
    IUserRepository userRepository, 
    IMapper mapper) : IShippingAgentRepService
{
    public async Task<string> CreateAsync(ShippingAgentRepresentativeDTO dto)
    {
        var existingUser = await userRepository.GetByEmailAsync(dto.Email);
        if (existingUser != null)
            throw new InvalidOperationException("Email already in use by another user.");

        var existingRep = await representativeRepository.ExistsByEmailAsync(dto.Email);
        if (existingRep)
            throw new InvalidOperationException("Representative with this email already exists.");

        var user = new User
        {
            Email = dto.Email,
            Role = UserRole.ShippingAgentRepresentative
        };
        
        await userRepository.CreateAsync(user);

        ShippingAgentRepresentative representative = new();
        mapper.Map(dto, representative);
        representative.Company = await dto.GetCompanyFromDTOCode(companyRepository);
        representative.User = user;

        return await representativeRepository.CreateAsync(representative);
    }

    public async Task<List<ShippingAgentRepresentative>> GetAllAsync()
    {
        return await representativeRepository.GetAllAsync();
    }

    public async Task<List<VVNDto>> GetSARVVNsAsync(string email)
    {
        var vvns = await representativeRepository.GetSARVVNsBySAREmailAsync(email);
        var dtos = mapper.Map<List<VVNDto>>(vvns);

        return dtos;
    }
}