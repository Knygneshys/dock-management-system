using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;

public class VesselTypeService(IVesselTypeRepository vesselTypeRepository) : IVesselTypeService
{
    public async Task<List<VesselType>> GetBySearchAsync(string? name, string? description,
        FilterOperator filterOperator)
    {
        var operationIsEquals = filterOperator.Equals(FilterOperator.Equals);
        
        var isNotValidFilterOperator = !operationIsEquals &&
                                         !filterOperator.Equals(FilterOperator.Contains);
        var bothVariablesAreEmpty = string.IsNullOrEmpty(name) && string.IsNullOrEmpty(description);
        
        if (isNotValidFilterOperator || bothVariablesAreEmpty)
        {
            return [];
        }

        var query = vesselTypeRepository.GetAllQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            name = name.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vesselType => vesselType.Name.ToLower().Equals(name));
            }
            else
            {
                query = query.Where(vesselType => vesselType.Name.ToLower().Contains(name));
            }
        }

        if (!string.IsNullOrEmpty(description))
        {
            description = description.ToLower();
            if (operationIsEquals)
            {
                query = query.Where(vesselType => vesselType.Description.ToLower().Equals(description));
            }
            else
            {
                query = query.Where(vesselType => vesselType.Description.ToLower().Contains(description));
            }
        }

        return await query.ToListAsync();
    }
}