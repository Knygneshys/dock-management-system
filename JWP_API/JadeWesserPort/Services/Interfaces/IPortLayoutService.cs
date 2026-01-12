using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.DTOs.PortLayoutDTOs;

namespace JadeWesserPort.Services.Interfaces
{
    public interface IPortLayoutService
    {
        Task<PortLayoutDto> GetLayoutAsync();
        
        public Task<StorageArea?> GetMostEmptyStorageAreaAsync();

        public MaterialProperties GetDockMaterialProperties();

        public MaterialProperties GetWarehouseMaterialProperties();

        public MaterialProperties GetYardMaterialProperties();

        public MaterialProperties GetPortGroundMaterialProperties();

        public MaterialProperties GetWaterMaterialProperties();
    }
}
