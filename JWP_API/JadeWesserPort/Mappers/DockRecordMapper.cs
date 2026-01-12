using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.DockRecordDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class DockRecordMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<DockRecord, DockRecordDto>()
            .Map(dest => dest.X, src => src.Position3D.X)
            .Map(dest => dest.Y, src => src.Position3D.Y)
            .Map(dest => dest.Z, src => src.Position3D.Z)
            .Map(dest => dest.VesselTypeCodes, src => src.AllowedVesselTypes.Select(v=>v.Code).ToList())
            .Map(dest => dest.NumberOfCranes, src => src.STSCranes.Count())
            .Map(dest => dest.Cranes, src => src.STSCranes);

        config.NewConfig<DockRecordUpdateDto, DockRecord>()
            .Map(dest => dest.Position3D.X, src => src.X)
            .Map(dest => dest.Position3D.Y, src => src.Y)
            .Map(dest => dest.Position3D.Z, src => src.Z)
            .Ignore(dest => dest.Code)
            .Ignore(dest => dest.Size3D)
            .Ignore(dest => dest.AllowedVesselTypes)
            .Ignore(dest => dest.STSCranes)
            .Ignore(dest => dest.Visits);
        
        config.NewConfig<DockRecordCreationDto, DockRecord>()
            .Map(dest => dest.Position3D.X, src => src.X)
            .Map(dest => dest.Position3D.Y, src => src.Y)
            .Map(dest => dest.Position3D.Z, src => src.Z)
            .Ignore(dest => dest.Code)
            .Ignore(dest => dest.Size3D)
            .Ignore(dest => dest.AllowedVesselTypes)
            .Ignore(dest => dest.STSCranes)
            .Ignore(dest => dest.Visits);

    }
}
