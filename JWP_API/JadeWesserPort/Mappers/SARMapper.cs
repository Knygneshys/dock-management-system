using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class SARMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ShippingAgentRepresentativeDTO, ShippingAgentRepresentative>()
            .IgnoreNullValues(true);
        config.NewConfig<ShippingAgentRepresentative, ShippingAgentRepresentativeDTO>()
            .Map(dst => dst.Email, src => src.User.Email)
            .Map(dst => dst.CompanyCode, src => src.Company.Code);
    }
}
