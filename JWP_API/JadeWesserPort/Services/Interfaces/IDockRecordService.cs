using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;

namespace JadeWesserPort.Services.Interfaces;

public interface IDockRecordService
{
    Task<List<DockRecord>> GetBySearchAsync(
        string? name, 
        string? vesselType, 
        string? location, 
        FilterOperator filterOperator);
}