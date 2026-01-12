using JadeWesserPort.Data;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace JadeWesserPort.Seeders;

public class StorageAreaSeeder(JWPDbContext _dbContext)
{
    public async Task SeedAsync()
    {
        if (await _dbContext.StorageAreas.AnyAsync())
            return;

        var storageAreas = GetStorageAreas();

        await _dbContext.StorageAreas.AddRangeAsync(storageAreas);
        await _dbContext.SaveChangesAsync();
    }

    private static IEnumerable<StorageArea> GetStorageAreas()
    {
        return
        [
            new StorageArea
            {
                Code = "Y-001",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = 0 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-002",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -100 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-003",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -200 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-004",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -300 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-005",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -400 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-006",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -500 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-007",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = -600 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-008",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = 100 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-009",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = 200 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-010",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 50, Y = 0, Z = 300 },
                Size3D = new Size3D { Width = 1, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-011",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = 0 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-012",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -100 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-013",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -200 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-014",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -300 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-015",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -400 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-016",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -500 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-017",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 150, Y = 0, Z = -600 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-018",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = 0 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-019",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -100 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-020",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -200 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-021",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -300 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-022",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -400 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-023",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -500 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "Y-024",
                Type = StorageAreaType.ContainerYard,
                Location = "North Terminal",
                MaxCapacity = 500,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 250, Y = 0, Z = -600 },
                Size3D = new Size3D { Width = 2, Height = 5, Depth = 50 }
            },
            new StorageArea
            {
                Code = "WH-001",
                Type = StorageAreaType.Warehouse,
                Location = "Port Exit",
                MaxCapacity = 300,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 1000, Y = 0, Z = 30 },
                Size3D = new Size3D { Width = 270, Height = 35, Depth = 70 }
            },
            new StorageArea
            {
                Code = "WH-002",
                Type = StorageAreaType.Warehouse,
                Location = "Insithe Road Circuit",
                MaxCapacity = 300,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 565, Y = 0, Z = -150 },
                Size3D = new Size3D { Width = 120, Height = 30, Depth = 70 }
            },
            new StorageArea
            {
                Code = "WH-003",
                Type = StorageAreaType.Warehouse,
                Location = "Far West",
                MaxCapacity = 300,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 600, Y = 0, Z = 260 },
                Size3D = new Size3D { Width = 200, Height = 40, Depth = 430 }
            },
            new StorageArea
            {
                Code = "WH-004",
                Type = StorageAreaType.Warehouse,
                Location = "Road Small",
                MaxCapacity = 300,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 450, Y = 0, Z = 60 },
                Size3D = new Size3D { Width = 50, Height = 15, Depth = 100 }
            },
            new StorageArea
            {
                Code = "WH-005",
                Type = StorageAreaType.Warehouse,
                Location = "Road Big",
                MaxCapacity = 300,
                CurrentOccupancy = 0,
                Position3D = new Vector3D { X = 400, Y = 0, Z = -70 },
                Size3D = new Size3D { Width = 90, Height = 20, Depth = 100 }
            },
        ];
    }
}
