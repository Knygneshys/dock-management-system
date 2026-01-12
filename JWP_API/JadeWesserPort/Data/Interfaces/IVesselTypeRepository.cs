using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselTypeDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface IVesselTypeRepository
{
    Task<string> CreateAsync(VesselType vesselType);

    Task<VesselType?> FindByCodeAsync(string code);

    Task<List<VesselType>> GetAllAsync();
  
    Task<VesselType?> UpdateAsync(string code, VesselTypeUpdateDto vesselTypeDto);

    IQueryable<VesselType> GetAllQueryable();
}