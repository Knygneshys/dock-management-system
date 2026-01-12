using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class DockStorageDistanceMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<DockStorageDistanceDto, DockStorageDistance>();
        config.NewConfig<DockStorageDistance, DockStorageDistanceDto>();
    }
}