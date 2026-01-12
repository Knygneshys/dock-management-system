using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class VesselTypeSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.VesselTypes.AnyAsync())
        {
            return;
        }

        var vesselTypes = GetVesselTypes();

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
    }
    private static IEnumerable<VesselType> GetVesselTypes()
    {
        return
        [
            new VesselType()
            {
                Id = Guid.NewGuid(),
                Code = "CONTAINER_2000",
                Name = "Container Ship 2000 TEU",
                Description = "A container ship with a capacity of 2000 TEU.",
                Capacity = 2000,
                MaxRows = 20,
                MaxBays = 10,
                MaxTiers = 10,
                Length = 200.0f,
                Draft = 10.0f
            },
            new VesselType()
            {
                Id = Guid.NewGuid(),
                Code = "BULK_5000",
                Name = "Bulk Carrier 5000 DWT",
                Description = "A bulk carrier with a deadweight tonnage of 5000 DWT.",
                Capacity = 5000,
                MaxRows = 15,
                MaxBays = 8,
                MaxTiers = 12,
                Length = 180.0f,
                Draft = 9.5f
            },
            new VesselType()
            {
                Id = Guid.NewGuid(),
                Code = "TANKER_3000",
                Name = "Tanker 3000 DWT",
                Description = "A tanker with a deadweight tonnage of 3000 DWT.",
                Capacity = 3000,
                MaxRows = 12,
                MaxBays = 6,
                MaxTiers = 10,
                Length = 150.0f,
                Draft = 8.0f
            }
        ];
    }
}
