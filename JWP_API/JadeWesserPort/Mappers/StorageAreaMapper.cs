using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.StorageAreaDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class StorageAreaMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<StorageArea, StorageAreaDto>()
            .Map(dest => dest.X, src => src.Position3D.X)
            .Map(dest => dest.Y, src => src.Position3D.Y)
            .Map(dest => dest.Z, src => src.Position3D.Z)
            .Map(dest => dest.Width, src => src.Size3D.Width)
            .Map(dest => dest.Depth, src => src.Size3D.Depth)
            .Map(dest => dest.Height, src => src.Size3D.Height)
            .Map(dest => dest.NumberOfCranes, src => src.YardCranes.Count());

        config.NewConfig<StorageAreaCreationDto, StorageArea>()
            .Map(dest => dest.Position3D.X, src => src.X)
            .Map(dest => dest.Position3D.Y, src => src.Y)
            .Map(dest => dest.Position3D.Z, src => src.Z)
            .Map(dest => dest.Size3D.Width, src => src.Width)
            .Map(dest => dest.Size3D.Height, src => src.Height)
            .Map(dest => dest.Size3D.Depth, src => src.Depth)
            .Ignore(dest => dest.StockItems)
            .Ignore(dest => dest.YardCranes)
            .Ignore(dest => dest.Docks);
        
        config.NewConfig<StorageAreaUpdateDto, StorageArea>()
            .Map(dest => dest.Position3D.X, src => src.X)
            .Map(dest => dest.Position3D.Y, src => src.Y)
            .Map(dest => dest.Position3D.Z, src => src.Z)
            .Map(dest => dest.Size3D.Width, src => src.Width)
            .Map(dest => dest.Size3D.Height, src => src.Height)
            .Map(dest => dest.Size3D.Depth, src => src.Depth)
            .Ignore(dest => dest.Code)
            .Ignore(dest => dest.StockItems)
            .Ignore(dest => dest.YardCranes)
            .Ignore(dest => dest.Docks); ;
        
    }
}