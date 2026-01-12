using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface IVesselRepository
{
    Task<string> CreateAsync(Vessel vessel);

    Task<Vessel?> UpdateAsync(string imo, VesselUpdateDto dto);

    Task<List<Vessel>> GetAllAsync();

    Task<Vessel?> GetByImoAsync(string imo);

    IQueryable<Vessel> GetAllQueryable();
}