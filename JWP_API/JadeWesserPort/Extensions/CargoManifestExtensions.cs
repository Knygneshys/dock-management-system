using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.CargoManifests;
using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using MapsterMapper;

namespace JadeWesserPort.Extensions;

public static class CargoManifestExtensions
{
    public static async Task<CargoLoadManifest> CreateLoadManifestFromDTOCodes(
        this LoadCargoManifestDTO loadManifestDto,
        IStockItemsRepository stockItemsRepository,
        IMapper mapper)
    {
        List<CargoItem> cargoItems = [];
        foreach (var itemCode in loadManifestDto.CargoItemCodes)
        {
            var stockItem = await stockItemsRepository.GetByIsoAsync(itemCode);
            if (stockItem is not null)
            {
                var ci = new CargoItem();
                mapper.Map(stockItem, ci);
                //TODO: Implement this in DTO
                ci.Id = Guid.NewGuid();
                ci.VesselContainerPosition = new ContainerPosition()
                {
                    Bay = 1,
                    Row = 1,
                    Tier = 1,
                };
                cargoItems.Add(ci);
            }
            else
            {
                throw new KeyNotFoundException($"Cargo item with code {itemCode} does not exist in stock!");
            }
        }
        CargoLoadManifest cargoLoadManifest = new();
        mapper.Map(loadManifestDto, cargoLoadManifest);
        cargoLoadManifest.CargoItems.AddRange(cargoItems);

        return cargoLoadManifest;
    }

    public static CargoUnloadManifest CreateUnloadManifestFromDTO(
        this UnloadCargoManifestDTO unloadManifestDto,
        IMapper mapper)
    {
        List<CargoItem> cargoItems = [];
        foreach (var cargoItemDto in unloadManifestDto.CargoItems)
        {
            var cargoItem = new CargoItem();
            mapper.Map(cargoItemDto, cargoItem);
            cargoItems.Add(cargoItem);
        }

        CargoUnloadManifest cargoUnloadManifest = new();
        mapper.Map(unloadManifestDto, cargoUnloadManifest);
        cargoUnloadManifest.CargoItems = cargoItems;

        return cargoUnloadManifest;
    }
}
