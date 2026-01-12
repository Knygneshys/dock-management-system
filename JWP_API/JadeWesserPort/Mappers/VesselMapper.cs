using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class VesselMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<VesselCreateDto, Vessel>()
            .Ignore(dst => dst.Type)
            .Ignore(dst => dst.TypeId)
            .Ignore(dst => dst.Owner)
            .Ignore(dst => dst.OwnerId)
            .Ignore(dst => dst.Operator)
            .Ignore(dst => dst.OperatorId);

        config.NewConfig<Vessel, VesselCreateDto>()
            .Map(dst => dst.TypeCode, src => src.Type.Code)
            .Map(dst => dst.OwnerCode, src => src.Owner.Code)
            .Map(dst => dst.OperatorCode, src => src.Operator.Code);

        config.NewConfig<Vessel, VesselDto>();

        config.NewConfig<VesselUpdateDto, Vessel>()
            .IgnoreNullValues(true)
            .Map(dst => dst.Name, src => src.Name);
        config.NewConfig<Vessel, VesselUpdateDto>();

        config.NewConfig<Vessel, VesselGetAllDto>()
            .PreserveReference(true)
            .Map(dst => dst.Type, src => src.Type.Name)
            .Map(dst => dst.Operator, src => src.Operator.Name)
            .Map(dst => dst.Owner, src => src.Owner.Name);
    }
}