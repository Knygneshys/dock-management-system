using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VVNDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class VVNMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<VesselVisitNotification, VVNCreateDTO>();
        config.NewConfig<VesselVisitNotification, VVNDto>()
            .IgnoreNullValues(true);

        config.NewConfig<VVNCreateDTO, VesselVisitNotification>()
            .Ignore(dst => dst.VesselId)
            .Ignore(dst => dst.Vessel)
            .Ignore(dst => dst.ShippingAgentRepresentativeId)
            .Ignore(dst => dst.ShippingAgentRepresentative)
            .IgnoreNullValues(true);

        config.NewConfig<VVNEditDto, VesselVisitNotification>()
            .IgnoreNullValues(true);

        config.NewConfig<VesselVisitNotification, VVNDto>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Eta, src => src.Eta)
            .Map(dest => dest.Etd, src => src.Etd)
            .Map(dest => dest.Status, src => src.Status);

        config.NewConfig<VVNDto, VesselVisitNotification>()
            .Map(dest => dest.Code, src => src.Code)
            .Map(dest => dest.Eta, src => src.Eta)
            .Map(dest => dest.Etd, src => src.Etd)
            .Map(dest => dest.Status, src => src.Status);
    }
}
