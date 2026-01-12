using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;

namespace JadeWesserPort.Extensions;

public static class SARExtensions
{
    public static async Task<Company> GetCompanyFromDTOCode(this ShippingAgentRepresentativeDTO dto, ICompanyRepository companyRepository)
    {
        var company = await companyRepository.GetByCodeAsync(dto.CompanyCode);
        if (company == null)
            throw new KeyNotFoundException("Company not found.");

        return company;
    }
}
