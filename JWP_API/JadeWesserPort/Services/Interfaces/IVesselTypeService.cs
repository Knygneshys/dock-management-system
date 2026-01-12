using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Services.Interfaces;

public interface IVesselTypeService
{
    Task<List<VesselType>> GetBySearchAsync(string? name, string? description, FilterOperator filterOperator);
}