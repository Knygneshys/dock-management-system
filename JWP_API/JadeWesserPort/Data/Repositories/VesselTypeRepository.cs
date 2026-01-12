using System;
using System.Threading.Tasks;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselTypeDTOs;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Data.Repositories;

public class VesselTypeRepository(JWPDbContext dbContext) : IVesselTypeRepository
{
    public async Task<string> CreateAsync(VesselType vesselType)
    {
        if(await dbContext.VesselTypes.AnyAsync(vt => vt.Code.Equals(vesselType.Code)))
        {
            throw new InvalidOperationException($"Vessel Type with code {vesselType.Code} already exists!");
        }

        await dbContext.VesselTypes.AddAsync(vesselType);
        await dbContext.SaveChangesAsync();

        return vesselType.Code;
    }

    public async Task<VesselType?> FindByCodeAsync(string code)
    {
        return await dbContext.VesselTypes.FirstOrDefaultAsync(vesselType => vesselType.Code.Equals(code));
    }

    public async Task<List<VesselType>> GetAllAsync()
    {
        return await dbContext.VesselTypes.ToListAsync();
    }
    
    public async Task<VesselType?> UpdateAsync(string code, VesselTypeUpdateDto vesselTypeDto)
    {
        var existingVesselType = await dbContext.VesselTypes.FirstOrDefaultAsync(vesselType => vesselType.Code.Equals(code));

        if (existingVesselType is null)
        {
            return null;
        }
        
        existingVesselType.Name = vesselTypeDto.Name;
        existingVesselType.Description = vesselTypeDto.Description;
        existingVesselType.Capacity = vesselTypeDto.Capacity;
        existingVesselType.MaxBays = vesselTypeDto.MaxBays;
        existingVesselType.MaxRows = vesselTypeDto.MaxRows;
        existingVesselType.MaxTiers = vesselTypeDto.MaxTiers;
        existingVesselType.Draft = vesselTypeDto.Draft;
        existingVesselType.Length = vesselTypeDto.Length;

        await dbContext.SaveChangesAsync();

        return existingVesselType;
    }

    public IQueryable<VesselType> GetAllQueryable()
    {
        return dbContext.VesselTypes.AsQueryable();
    }
}