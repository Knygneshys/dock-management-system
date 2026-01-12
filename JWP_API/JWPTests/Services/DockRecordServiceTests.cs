using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace JWPTests.Services;

[TestFixture]
public class DockRecordServiceTests
{
    private IDockRecordService _dockRecordService;
    private IDockRecordRepository _dockRecordRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _dockRecordRepository = new DockRecordRepository(_dbContext);
        _dockRecordService = new DockRecordService(_dockRecordRepository);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task GetBySearchAsync_SearchByNameWithContainsOperator_ShouldReturnDocksThatContainName()
    {
        // Arrange
        const string filterName = "Dock";
        const FilterOperator filterOperator = FilterOperator.Contains;

        const string name1 = "Main Dock";
        const string name2 = "Secondary Dock";
        const string otherName = "Harbor Terminal";

        List<DockRecord> docks =
        [
            new() { Id = Guid.NewGuid(), Code = "DCK-001", Name = name1, Location = "Hamburg" },
            new() { Id = Guid.NewGuid(), Code = "DCK-002", Name = name2, Location = "Berlin" },
            new() { Id = Guid.NewGuid(), Code = "DCK-003", Name = otherName, Location = "Bremen" }
        ];

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordService.GetBySearchAsync(filterName, null, null, filterOperator);

        // Assert
        const int expectedCount = 2;

        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.Select(r => r.Name).Should().Contain(name1);
            results.Select(r => r.Name).Should().Contain(name2);
            results.Select(r => r.Name).Should().NotContain(otherName);
        }
    }

    [Test]
    public async Task GetBySearchAsync_SearchByNameWithEqualsOperator_ShouldReturnDocksWithExactlyEqualName()
    {
        // Arrange
        const string inputName = "Main Dock";          // exakt so wie in der DB
        const FilterOperator filterOperator = FilterOperator.Equals;

        const string equalName = "Main Dock";
        const string differentCase = "main dock";
        const string randomName = "Other Dock";

        List<DockRecord> docks =
        [
            new() { Id = Guid.NewGuid(), Code = "DCK-010", Name = equalName, Location = "Lisbon" },
            new() { Id = Guid.NewGuid(), Code = "DCK-011", Name = differentCase, Location = "Porto" },
            new() { Id = Guid.NewGuid(), Code = "DCK-012", Name = randomName, Location = "Porto" }
        ];

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordService.GetBySearchAsync(inputName, null, null, filterOperator);

        // Assert
        const int expectedCount = 1;

        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.Single().Name.Should().Be(equalName);
        }
    }

    [Test]
    public async Task GetBySearchAsync_SearchByLocationWithContainsOperator_ShouldReturnDocksThatContainLocation()
    {
        // Arrange
        const string filterLocation = "Port";
        const FilterOperator filterOperator = FilterOperator.Contains;

        const string location1 = "Porto";
        const string location2 = "Port Elizabeth";
        const string randomLocation = "Hamburg";

        List<DockRecord> docks =
        [
            new() { Id = Guid.NewGuid(), Code = "DCK-101", Name = "North Dock", Location = location1 },
            new() { Id = Guid.NewGuid(), Code = "DCK-102", Name = "South Dock", Location = location2 },
            new() { Id = Guid.NewGuid(), Code = "DCK-103", Name = "Other Dock", Location = randomLocation }
        ];

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordService.GetBySearchAsync(null, null, filterLocation, filterOperator);

        // Assert
        const int expectedCount = 2;

        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.Select(r => r.Location).Should().Contain(location1);
            results.Select(r => r.Location).Should().Contain(location2);
            results.Select(r => r.Location).Should().NotContain(randomLocation);
        }
    }

    [Test]
    public async Task GetBySearchAsync_SearchByVesselTypeNameWithContainsOperator_ShouldReturnMatchingDocks()
    {
        // Arrange
        const string filterVesselType = "container";
        const FilterOperator filterOperator = FilterOperator.Contains;

        var containerType = new VesselType
        {
            Id = Guid.NewGuid(),
            Code = "VT01",
            Name = "Container Vessel",
            Description = "Test"
        };

        var tankerType = new VesselType
        {
            Id = Guid.NewGuid(),
            Code = "VT02",
            Name = "Tanker",
            Description = "Test"
        };

        var dock1 = new DockRecord
        {
            Id = Guid.NewGuid(),
            Code = "DCK-201",
            Name = "Deepwater Dock",
            Location = "Wilhelmshaven",
            AllowedVesselTypes = [containerType]
        };

        var dock2 = new DockRecord
        {
            Id = Guid.NewGuid(),
            Code = "DCK-202",
            Name = "Oil Dock",
            Location = "Hamburg",
            AllowedVesselTypes = [tankerType]
        };

        await _dbContext.VesselTypes.AddRangeAsync(containerType, tankerType);
        await _dbContext.DockRecords.AddRangeAsync(dock1, dock2);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordService.GetBySearchAsync(null, filterVesselType, null, filterOperator);

        // Assert
        using (new AssertionScope())
        {
            results.Should().HaveCount(1);
            results.Single().Code.Should().Be("DCK-201");
        }
    }

    [Test]
    public async Task GetBySearchAsync_NoInputsOrInvalidFilterOperator_ShouldReturnEmptyList()
    {
        // Arrange
        List<DockRecord> docks =
        [
            new() { Id = Guid.NewGuid(), Code = "DCK-301", Name = "Dock 1", Location = "Lisbon" },
            new() { Id = Guid.NewGuid(), Code = "DCK-302", Name = "Dock 2", Location = "Porto" }
        ];

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();
        
        var resultsEmpty = await _dockRecordService.GetBySearchAsync(null, null, null, FilterOperator.Contains);
        var invalidFilterOperator = (FilterOperator)999;
        var resultsInvalid = await _dockRecordService.GetBySearchAsync("Dock", null, null, invalidFilterOperator);

        // Assert
        using (new AssertionScope())
        {
            resultsEmpty.Should().BeEmpty();
            resultsInvalid.Should().BeEmpty();
        }
    }
}
