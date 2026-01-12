using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class VesselRepository(JWPDbContext dbContext) : IVesselRepository
{
    public async Task<string> CreateAsync(Vessel vessel)
    {
        if(await dbContext.Vessels.AnyAsync(v => v.Imo.Equals(vessel.Imo)))
        {
            throw new ArgumentException($"Vessel with IMO number {vessel.Imo} already exists.");
        }
        await dbContext.AddAsync(vessel);
        await dbContext.SaveChangesAsync();

        return vessel.Imo;
    }

    public async Task<Vessel?> UpdateAsync(string imo, VesselUpdateDto dto)
    {
        var vessel = await dbContext.Vessels.FirstOrDefaultAsync(vessel => vessel.Imo.Equals(imo));

        if (vessel is null)
        {
            return null;
        }

        var vesselType = await dbContext.VesselTypes.FirstOrDefaultAsync(vt => vt.Code.Equals(dto.TypeCode));
        var vesselOperator = await dbContext.Companies.FirstOrDefaultAsync(company => company.Code.Equals(dto.OperatorCode));
        var owner = await dbContext.Companies.FirstOrDefaultAsync(company => company.Code.Equals(dto.OwnerCode));

        if (vesselType is null || owner is null || vesselOperator is null)
        {
            return null;
        }

        vessel.Imo = dto.Imo;
        vessel.Name = dto.Name;
        vessel.TypeId = vesselType.Id;
        vessel.Type = vesselType;
        vessel.OperatorId = vesselOperator.Id;
        vessel.Operator = vesselOperator;
        vessel.OwnerId = owner.Id;
        vessel.Owner = owner;

        await dbContext.SaveChangesAsync();

        return vessel;
    }

    public async Task<List<Vessel>> GetAllAsync()
    {
        return await dbContext.Vessels
            .Include(e => e.Owner)
            .Include(e => e.Operator)
            .Include(e => e.Type)
            .ToListAsync();
    }

    public IQueryable<Vessel> GetAllQueryable()
    {
        return dbContext.Vessels
            .Include(vessel => vessel.Type)
            .Include(vessel => vessel.Owner)
            .Include(vessel => vessel.Operator)
            .AsQueryable();
    }

    public Task<Vessel?> GetByImoAsync(string imo)
    {
        Vessel? vessel = dbContext.Vessels
            .Include(v => v.Owner)
            .Include(v => v.Operator)
            .Include(v => v.Type)
            .FirstOrDefault(v => v.Imo.Equals(imo));
        return Task.FromResult(vessel);
    }
}