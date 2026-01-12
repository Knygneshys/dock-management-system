using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain;
using JadeWesserPort.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Services;

public class DockRecordService(IDockRecordRepository dockRecordRepository) : IDockRecordService
{
    public async Task<List<DockRecord>> GetBySearchAsync(
        string? name,
        string? vesselType,
        string? location,
        FilterOperator filterOperator)
    {
        var isEquals = filterOperator.Equals(FilterOperator.Equals);

        var invalidFilterOperator =
            !isEquals && !filterOperator.Equals(FilterOperator.Contains);

        var noInputsProvided =
            string.IsNullOrEmpty(name) &&
            string.IsNullOrEmpty(location) &&
            string.IsNullOrEmpty(vesselType);

        if (invalidFilterOperator || noInputsProvided)
            return [];

        var query = dockRecordRepository.GetAllQueryable()
            .Include(d => d.AllowedVesselTypes)
            .AsQueryable();
        
        if (!string.IsNullOrEmpty(name))
        {
            if (isEquals)
            {
                query = query.Where(d => d.Name.Equals(name));
            }
            else
            {
                var lower = name.ToLower();
                query = query.Where(d => d.Name.ToLower().Contains(lower));
            }
        }
        
        if (!string.IsNullOrEmpty(location))
        {
            if (isEquals)
            {
                query = query.Where(d => d.Location.Equals(location));
            }
            else
            {
                var lower = location.ToLower();
                query = query.Where(d => d.Location.ToLower().Contains(lower));
            }
        }
        
        if (!string.IsNullOrEmpty(vesselType))
        {
            if (isEquals)
            {
                query = query.Where(d =>
                    d.AllowedVesselTypes.Any(vt => vt.Name.Equals(vesselType)));
            }
            else
            {
                var lower = vesselType.ToLower();
                query = query.Where(d =>
                    d.AllowedVesselTypes.Any(vt => vt.Name.ToLower().Contains(lower)));
            }
        }

        return await query.ToListAsync();
    }
}
