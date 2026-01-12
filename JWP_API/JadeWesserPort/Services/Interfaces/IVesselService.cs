using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;
using Microsoft.AspNetCore.Mvc;

namespace JWPTests.Services.Interfaces;

public interface IVesselService
{
    bool CheckIfImoNumberIsValidAsync(string imoNumber);

    Task<IEnumerable<Vessel>?> GetByFilterAsync(string? imo, string? name, string? operatorName, FilterOperator filterOperator);

    Task<IEnumerable<Vessel>> GetBySearchAsync(string? imo, string? name, string? operatorCode,
        FilterOperator filterOperator);
}