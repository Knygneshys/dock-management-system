using JadeWesserPort.Data;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.CargoManifests;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class VVNSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.VesselVisitNotifications.AnyAsync())
            return;

        var vvns = GetVVNs(_dbContext).Result;

        await _dbContext.VesselVisitNotifications.AddRangeAsync(vvns);
        await _dbContext.SaveChangesAsync();
    }

    private static async Task<IEnumerable<VesselVisitNotification>> GetVVNs(JWPDbContext _dbContext)
    {
        var sar1 = await _dbContext.ShippingAgentRepresentatives
            .FirstOrDefaultAsync(e => e.User.Email.Equals("robbie@gmail.com"));
        var sar2 = await _dbContext.ShippingAgentRepresentatives
            .FirstOrDefaultAsync(e => e.User.Email.Equals("alexa@gmail.com"));
        var vessels = await _dbContext.Vessels.ToListAsync();

        return
        [
            new VesselVisitNotification()
            {
                Code = 1001,
                Eta = DateTime.UtcNow.AddDays(7),
                Etd = DateTime.UtcNow.AddDays(12),
                Status = VVNStatus.Submitted,
                Vessel = vessels[0],
                ShippingAgentRepresentative = sar1!,
                CargoUnloadManifest = GetCargoUnloadManifest(0),
            },
            new VesselVisitNotification()
            {
                Code = 1002,
                Eta = DateTime.UtcNow.AddDays(7),
                Etd = DateTime.UtcNow.AddDays(12),
                Status = VVNStatus.Submitted,
                Vessel = vessels[0],
                ShippingAgentRepresentative = sar2!,
                CargoUnloadManifest = GetCargoUnloadManifest(3),
            },
            new VesselVisitNotification()
            {
                Code = 1003,
                Eta = DateTime.UtcNow.AddDays(7),
                Etd = DateTime.UtcNow.AddDays(12),
                Status = VVNStatus.Submitted,
                Vessel = vessels[1],
                ShippingAgentRepresentative = sar1!,
                CargoUnloadManifest = GetCargoUnloadManifest(4),
            },
            new VesselVisitNotification()
            {
                Code = 1004,
                Eta = DateTime.UtcNow.AddDays(7),
                Etd = DateTime.UtcNow.AddDays(12),
                Status = VVNStatus.Submitted,
                Vessel = vessels[2],
                ShippingAgentRepresentative = sar1!
            },
            new VesselVisitNotification()
            {
                Code = 1005,
                Eta = DateTime.UtcNow.AddDays(7),
                Etd = DateTime.UtcNow.AddDays(12),
                Status = VVNStatus.Submitted,
                Vessel = vessels[0],
                ShippingAgentRepresentative = sar1!,
                CargoUnloadManifest = GetCargoUnloadManifest(7),
            },
            new VesselVisitNotification()
            {
                Code = 1006,
                Eta = DateTime.UtcNow.AddDays(1),
                Etd = DateTime.UtcNow.AddDays(3),
                Status = VVNStatus.Submitted,
                Vessel = vessels[1],
                ShippingAgentRepresentative = sar1!,
                CargoUnloadManifest = GetCargoUnloadManifest(6),
            }
        ];
    }

    private static CargoUnloadManifest GetCargoUnloadManifest(int i)
    {
        CargoUnloadManifest cm1 = new()
        {
            Code = "1",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3)]
        };
        CargoUnloadManifest cm2 = new()
        {
            Code = "2",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(4), GetCargoItem(5), GetCargoItem(6), GetCargoItem(7), GetCargoItem(8), GetCargoItem(9), GetCargoItem(10), GetCargoItem(11)]
        };
        CargoUnloadManifest cm3 = new()
        {
            Code = "3",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(12), GetCargoItem(13), GetCargoItem(14)]
        };
        CargoUnloadManifest cm4 = new()
        {
            Code = "4",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(15), GetCargoItem(16), GetCargoItem(17), GetCargoItem(18), GetCargoItem(19), GetCargoItem(20),]
        };
        CargoUnloadManifest cm5 = new()
        {
            Code = "5",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(21)]
        };
        CargoUnloadManifest cm6 = new()
        {
            Code = "6",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(22), GetCargoItem(23), GetCargoItem(24), GetCargoItem(25), GetCargoItem(26), GetCargoItem(27), GetCargoItem(28)]
        };
        CargoUnloadManifest cm7 = new()
        {
            Code = "7",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(29), GetCargoItem(30), GetCargoItem(31), GetCargoItem(32)]
        };
        CargoUnloadManifest cm8 = new()
        {
            Code = "8",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(33), GetCargoItem(34), GetCargoItem(35), GetCargoItem(36), GetCargoItem(37), GetCargoItem(38)]
        };

        List<CargoUnloadManifest> list = [cm1, cm2, cm3, cm4, cm5, cm6, cm7, cm8];

        return list[i];
    }

    private static CargoLoadManifest GetCargoLoadManifest(int i)
    {
        CargoLoadManifest cm1 = new()
        {
            Code = "1",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3)]
        };
        CargoLoadManifest cm2 = new()
        {
            Code = "2",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3), GetCargoItem(4), GetCargoItem(5), GetCargoItem(6), GetCargoItem(7)]
        };
        CargoLoadManifest cm3 = new()
        {
            Code = "3",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(3)]
        };
        CargoLoadManifest cm4 = new()
        {
            Code = "4",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3), GetCargoItem(4), GetCargoItem(5),]
        };
        CargoLoadManifest cm5 = new()
        {
            Code = "5",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0)]
        };
        CargoLoadManifest cm6 = new()
        {
            Code = "6",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3), GetCargoItem(5), GetCargoItem(6), GetCargoItem(7)]
        };
        CargoLoadManifest cm7 = new()
        {
            Code = "7",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3)]
        };
        CargoLoadManifest cm8 = new()
        {
            Code = "8",
            Description = "_",
            CargoType = Domain.Enums.CargoType.General,
            CargoItems = [GetCargoItem(0), GetCargoItem(1), GetCargoItem(2), GetCargoItem(3), GetCargoItem(5), GetCargoItem(7)]
        };

        List<CargoLoadManifest> list = [cm1, cm2, cm3, cm4, cm5, cm6, cm7, cm8];

        return list[i];
    }

    private static CargoItem GetCargoItem(int index)
    {
        var positions = new[]
        {
            (1, 1, 1), (2, 1, 1), (1, 2, 1), (1, 1, 2),
            (2, 2, 1), (2, 2, 2), (3, 1, 1), (1, 1, 3),
            (2, 2, 3), (3, 2, 3), (3, 1, 3), (3, 2, 4),
            (3, 2, 1), (2, 3, 4), (3, 3, 5), (3, 4, 3),
            (5, 5, 5), (6, 5, 5), (5, 6, 5), (5, 5, 6),
            (6, 6, 5), (6, 6, 6), (7, 5, 5), (5, 5, 7),
            (4, 1, 1), (4, 2, 2), (4, 3, 3), (4, 4, 4),
            (1, 4, 1), (2, 4, 2), (3, 4, 3), (4, 4, 1),
            (5, 1, 1), (6, 2, 2), (7, 3, 3), (8, 4, 4),
            (1, 5, 1), (2, 6, 2), (3, 7, 3), (4, 8, 1),
            (8, 8, 8), (9, 9, 9), (10, 1, 1), (1, 10, 1),
            (2, 5, 3), (3, 6, 4), (4, 7, 5), (5, 8, 6),
            (6, 7, 8), (7, 6, 5), (8, 5, 4), (9, 4, 3),
            (10, 3, 2), (10, 10, 1), (9, 8, 7), (7, 9, 6)
        };

        var safeIndex = index % positions.Length;
        var (bay, row, tier) = positions[safeIndex];

        return new CargoItem
        {
            ContainerISO = $"ISO{100000 + (index * 12345) % 900000:000000}", // ID único
            Description = "Container",
            From = "Porto",
            To = "London",
            VesselContainerPosition = new() { Bay = bay, Row = row, Tier = tier }
        };
    }
}
