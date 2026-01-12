using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CargoItemDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class CargoItemMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CargoItemDTO, CargoItem>();
        config.NewConfig<CargoItem, CargoItemDTO>();
        config.NewConfig<StockItem, CargoItem>();
    }
}
