using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselTypeDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class VesselTypeMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<VesselTypeDto, VesselType>();
    }
}