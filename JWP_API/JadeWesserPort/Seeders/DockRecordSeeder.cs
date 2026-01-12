using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class DockRecordSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.DockRecords.AnyAsync())
            return;

        var docks = await GetDocks(_dbContext);

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<DockRecord>> GetDocks(JWPDbContext _dbContext)
    {
        var vesselTypes = await _dbContext.VesselTypes.ToListAsync();
        return
        [
            new DockRecord
            {
                Id = Guid.NewGuid(),
                Code = "DOCK-A",
                Name = "Dock A",
                Location = "North Terminal",
                Length = 180,
                Depth = 12,
                MaxDraft = 10,
                Position3D = new Vector3D { X = -5, Y = 0, Z = 230 },
                Size3D = new Size3D { Width = 12, Height = 5, Depth = 100 },
                AllowedVesselTypes = vesselTypes
            },

            new DockRecord
            {
                Id = Guid.NewGuid(),
                Code = "DOCK-B",
                Name = "Dock B",
                Location = "East Terminal",
                Length = 200,
                Depth = 14,
                MaxDraft = 12,
                Position3D = new Vector3D { X = -5, Y = 0, Z = 0 },
                Size3D = new Size3D { Width = 12, Height = 5, Depth = 120 },
                AllowedVesselTypes = vesselTypes
            },

            new DockRecord
            {
                Id = Guid.NewGuid(),
                Code = "DOCK-C",
                Name = "Dock C",
                Location = "Easteast Terminal",
                Length = 200,
                Depth = 14,
                MaxDraft = 12,
                Position3D = new Vector3D { X = -5, Y = 0, Z = -300 },
                Size3D = new Size3D { Width = 12, Height = 5, Depth = 120 },
                AllowedVesselTypes = vesselTypes
            },

            new DockRecord
            {
                Id = Guid.NewGuid(),
                Code = "DOCK-D",
                Name = "Dock D",
                Location = "East Terminal",
                Length = 200,
                Depth = 14,
                MaxDraft = 12,
                Position3D = new Vector3D { X = -5, Y = 0, Z = 500 },
                Size3D = new Size3D { Width = 12, Height = 5, Depth = 120 },
                AllowedVesselTypes = vesselTypes
            }
        ];
    }
}
