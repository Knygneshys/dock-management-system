using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CompanyDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class CompanyMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CompanyDto, Company>();
        config.NewConfig<Company, CompanyDto>();
    }
}