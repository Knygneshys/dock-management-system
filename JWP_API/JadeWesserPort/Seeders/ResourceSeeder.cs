using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class ResourceSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.Resources.AnyAsync())
        {
            return;
        }

        var resources = await GetResourcesAsync(_dbContext);

        await _dbContext.Resources.AddRangeAsync(resources);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<Resource>> GetResourcesAsync(JWPDbContext _dbContext)
    {
        var qualifications = await _dbContext.Qualifications.ToListAsync();
        var yards = await _dbContext.StorageAreas.Where(s => s.Type.Equals(StorageAreaType.ContainerYard)).ToListAsync();
        var docks = await _dbContext.DockRecords.ToListAsync();
        List<Resource> resources = [];
        int i = 1;
        foreach (var dock in docks)
        {
            var r = new STSCrane()
            {
                AlphanumericCode = $"STS-0{i}",
                Description = $"Main STS Crane for dock ${dock.Code}",
                Status = ResourceStatus.Active,
                SetupTimeMinutes = 5,
                DockRecord = dock,
            };
            r.Qualifications.Add(qualifications.Where(q => q.Code.Equals("L-STS")).FirstOrDefault(qualifications[0]));
            resources.Add(r);
            i++;
            if(dock.Code.Equals("DOCK-A") || dock.Code.Equals("DOCK-C"))
            {
                var r2 = new STSCrane()
                {
                    AlphanumericCode = $"STS-0{i}",
                    Description = $"Backup STS Crane for dock ${dock.Code}",
                    Status = ResourceStatus.Active,
                    SetupTimeMinutes = 5,
                    DockRecord = dock,
                };
                r2.Qualifications.Add(qualifications.Where(q => q.Code.Equals("L-STS")).FirstOrDefault(qualifications[0]));
                resources.Add(r2);
                i++;
            }
        }
        

        var r3 = new TerminalTruck()
        {
            AlphanumericCode = "TRK-001",
            Description = "Terminal Truck 001",
            Status = ResourceStatus.Active,
            SetupTimeMinutes = 1
        };
        r3.Qualifications.Add(qualifications.Where(q => q.Code.Equals("L-TRK")).FirstOrDefault(qualifications[0]));
        resources.Add(r3);

        i = 1;
        foreach (var yard in yards)
        {
            var r = new YardCrane()
            {
                AlphanumericCode = $"YC-0{i}",
                Description = $"Yard Crane {i}",
                Status = ResourceStatus.Active,
                SetupTimeMinutes = 3,
                StorageArea = yard,
            };
            r.Qualifications.Add(qualifications.Where(q => q.Code.Equals("L-YC")).FirstOrDefault(qualifications[0]));
            resources.Add(r);
            i++;
        }

        return resources;
    }
}
