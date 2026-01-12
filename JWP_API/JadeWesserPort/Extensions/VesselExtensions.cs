using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;

namespace JadeWesserPort.Extensions;
public static class VesselExtensions
{
    public static async Task<VesselType> DTOVesselTypeCodeToVesselType(this VesselCreateDto vesselCreateDto, IVesselTypeRepository vesselTypeRepository)
    {
        var vesselType = await vesselTypeRepository.FindByCodeAsync(vesselCreateDto.TypeCode);

        if(vesselType is not null)
        {
            return vesselType;
        }
        else
        {
            throw new InvalidOperationException($"Vessel type with code {vesselCreateDto.TypeCode} does not exist!");
        }
    }

    public static async Task<Company> DTOOwnerCodeToCompany(this VesselCreateDto dto, ICompanyRepository companyRepository)
    {
        return await DTOCompanyCodeToCompany(dto.OwnerCode, companyRepository);
    }

    public static async Task<Company> DTOOperatorCodeToCompany(this VesselCreateDto dto, ICompanyRepository companyRepository)
    {
        return await DTOCompanyCodeToCompany(dto.OperatorCode, companyRepository);
    }

    private static async Task<Company> DTOCompanyCodeToCompany(string code, ICompanyRepository companyRepository)
    {
        var company = await companyRepository.GetByCodeAsync(code);

        if (company is not null)
        {
            return company;
        }
        else
        {
            throw new InvalidOperationException($"Company with code {code} does not exist.");
        }
    }
}

