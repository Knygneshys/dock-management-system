using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class DockStorageDistanceRepositoryTests
{
    private JWPDbContext _context;
    private DockStorageDistanceRepository _repository;

    [SetUp]
    public void SetUp()
    {
        _context = JwpInMemoryDbContext.GetContext();
        _repository = new DockStorageDistanceRepository(_context);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _context.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_GivenValidEntity_ShouldPersistToDatabase()
    {
        // Arrange
        var dock = new DockRecordProvider().Provide();
        var storage = new StorageAreaProvider().Provide();

        await _context.DockRecords.AddAsync(dock);
        await _context.StorageAreas.AddAsync(storage);
        await _context.SaveChangesAsync();

        var entity = new DockStorageDistance
        {
            Code = "DSD-001",
            DockRecordId = dock.Id,
            StorageAreaId = storage.Id,
            DistanceMeters = 1000,
            Notes = "Close to main dock"
        };

        // Act
        await _repository.CreateAsync(entity);
        var saved = await _context.DockStorageDistances.FirstOrDefaultAsync(d => d.Code == entity.Code);

        // Assert
        using (new AssertionScope())
        {
            saved.Should().NotBeNull();
            saved!.DistanceMeters.Should().Be(1000);
            saved.DockRecordId.Should().Be(dock.Id);
            saved.StorageAreaId.Should().Be(storage.Id);
        }
    }

    [Test]
    public async Task FindByCodeAsync_GivenExistingCode_ShouldReturnEntity()
    {
        var dock = new DockRecordProvider().Provide();
        var storage = new StorageAreaProvider().Provide();

        var entity = new DockStorageDistance
        {
            Code = "DSD-002",
            DockRecord = dock,
            StorageArea = storage,
            DistanceMeters = 750
        };

        await _context.DockStorageDistances.AddAsync(entity);
        await _context.SaveChangesAsync();

        // Act
        var found = await _repository.FindByCodeAsync("DSD-002");

        // Assert
        found.Should().NotBeNull();
        found!.Code.Should().Be("DSD-002");
    }

    [Test]
    public async Task GetAllQueryable_ShouldReturnAllDockStorageDistances()
    {
        // Arrange
        var dock = new DockRecordProvider().Provide();
        var storage = new StorageAreaProvider().Provide();

        var distances = new List<DockStorageDistance>
        {
            new() { Code = "DSD-003", DockRecord = dock, StorageArea = storage, DistanceMeters = 1200 },
            new() { Code = "DSD-004", DockRecord = dock, StorageArea = storage, DistanceMeters = 1800 }
        };

        await _context.DockStorageDistances.AddRangeAsync(distances);
        await _context.SaveChangesAsync();

        // Act
        var result = _repository.GetAllQueryable().ToList();

        // Assert
        result.Should().HaveCount(2);
        result.Should().Contain(d => d.Code == "DSD-003");
    }
}
