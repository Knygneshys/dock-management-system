using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class CargoManifestMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CargoManifest, CargoManifestDTO>();

        config.NewConfig<CargoManifestDTO, CargoManifest>()
            .Ignore(dst => dst.CargoItems)
            .Ignore(dst => dst.VVN);
        config.NewConfig<StockItem, CargoItem>()
            .IgnoreNullValues(true);
        config.NewConfig<CargoItem, StockItem>()
            .IgnoreNullValues(true);
    }
}
