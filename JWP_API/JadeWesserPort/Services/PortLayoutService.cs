using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.ValueObjects;
using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.DTOs.PortLayoutDTOs;
using JadeWesserPort.DTOs.StorageAreaDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;

public class PortLayoutService(
    IDockRecordRepository docks,
    IStorageAreaRepository storageAreas,
    IMapper mapper) : IPortLayoutService
{

    public async Task<PortLayoutDto> GetLayoutAsync()
    {
        var dockEntities = await docks.GetAllAsync();
        var storageEntities = await storageAreas.GetAllQueryable().ToListAsync();

        var dockDtos = mapper.Map<List<DockRecordDto>>(dockEntities);
        var storageAreaDtos = mapper.Map<List<StorageAreaDto>>(storageEntities);

        return new PortLayoutDto
        {
            Docks = dockDtos,
            StorageAreas = storageAreaDtos
        };
    }

    public async Task<StorageArea?> GetMostEmptyStorageAreaAsync()
    {
        return await storageAreas.GetAllQueryable().FirstOrDefaultAsync();
    }

    public MaterialProperties GetDockMaterialProperties()
    {
        return new MaterialProperties()
        {
            ColorMap = "/textures/wood/wood_color.jpg",
            RoughnessMap = "/textures/wood/wood_roughness.jpg",
            NormalMap = "/textures/wood/wood_normal.jpg",
            Roughness = 0.8f,
            Metalness = 0.0f,
            BaseColor = "#6B4423"
        };
    }

    public MaterialProperties GetWarehouseMaterialProperties()
    {
        return new MaterialProperties()
        {
            ColorMap = "/textures/corrugated_iron/corrugated_iron_color.jpg",
            RoughnessMap = "/textures/corrugated_iron/corrugated_iron_roughness.jpg",
            NormalMap = "/textures/corrugated_iron/corrugated_iron_normal.jpg",
            Roughness = 0.5f,
            Metalness = 1.0f,
            BaseColor = "#d3d3d3"
        };
    }

    public MaterialProperties GetYardMaterialProperties()
    {
        return new MaterialProperties()
        {
            ColorMap = "/textures/dirty_concrete/dirty_concrete_color.jpg",
            RoughnessMap = "/textures/dirty_concrete/dirty_concrete_roughness.jpg",
            NormalMap = "/textures/dirty_concrete/dirty_concrete_normal.jpg",
            Roughness = 0.8f,
            Metalness = 0.0f,
            BaseColor = "#d3d3d3"
        };
    }

    public MaterialProperties GetPortGroundMaterialProperties()
    {
        return new MaterialProperties()
        {
            ColorMap = "/textures/gravel_embedded_concrete/gravel_embedded_concrete_color.jpg",
            RoughnessMap = "/textures/gravel_embedded_concrete/gravel_embedded_concrete_roughness.jpg",
            NormalMap = "/textures/gravel_embedded_concrete/gravel_embedded_concrete_normal.jpg",
            Roughness = 0.7f,
            Metalness = 0.0f,
            BaseColor = "#f2f2f2"
        };
    }

    public MaterialProperties GetWaterMaterialProperties()
    {
        return new MaterialProperties()
        {
            ColorMap = "/textures/water/water_color.jpg",
            NormalMap = "/textures/water/water_normal.jpg",
            Roughness = 0.0f,
            Metalness = 0.0f,
            BaseColor = "#ADD8E6"
        };
    }
}
