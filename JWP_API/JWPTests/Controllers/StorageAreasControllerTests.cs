using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.StorageAreaDTOs;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;

[TestFixture]
public class StorageAreasControllerTests
{
    private StorageAreasController _controller;
    private IStorageAreaRepository _storageAreaRepository;
    private IDockRecordRepository _dockRecordRepository;
    private IDockStorageDistanceRepository _dockStorageDistanceRepository;
    private IMapper _mapper;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();

        _storageAreaRepository = new StorageAreaRepository(_dbContext);
        _dockRecordRepository = new DockRecordRepository(_dbContext);
        _dockStorageDistanceRepository = new DockStorageDistanceRepository(_dbContext);

        var config = new TypeAdapterConfig();
        _mapper = new Mapper(config);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<StorageAreasController>.Instance;

        _controller = new StorageAreasController(
            _storageAreaRepository,
            _dockRecordRepository,
            _dockStorageDistanceRepository,
            mockAuthService.Object,
            _mapper,
            logger
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }
    
    [Test]
    public async Task UpdateAsync_ValidData_ShouldUpdateStorageArea()
    {
        // Arrange
        var existing = new StorageArea
        {
            Id = Guid.NewGuid(),
            Code = "SA-001",
            Type = StorageAreaType.ContainerYard,
            Location = "Sector A",
            MaxCapacity = 1000,
            CurrentOccupancy = 200
        };

        await _dbContext.StorageAreas.AddAsync(existing);
        await _dbContext.SaveChangesAsync();

        var dto = new StorageAreaUpdateDto
        {
            Type = StorageAreaType.Warehouse,
            Location = "Sector B",
            MaxCapacity = 1500,
            CurrentOccupancy = 300
        };

        // Act
        var result = await _controller.UpdateAsync(existing.Code, dto);

        // Assert
        using (new AssertionScope())
        {
            result.Should().BeOfType<OkObjectResult>();

            var updated = await _dbContext.StorageAreas
                .FirstOrDefaultAsync(sa => sa.Code == "SA-001");

            updated.Should().NotBeNull();
            updated.Type.Should().Be(StorageAreaType.Warehouse);
            updated.Location.Should().Be("Sector B");
            updated.MaxCapacity.Should().Be(1500);
            updated.CurrentOccupancy.Should().Be(300);
        }
    }
    
    [Test]
    public async Task UpdateAsync_WhenExceedsCapacity_ShouldReturnBadRequest()
    {
        // Arrange
        var storage = new StorageArea
        {
            Id = Guid.NewGuid(),
            Code = "SA-002",
            Type = StorageAreaType.ContainerYard,
            Location = "Sector C",
            MaxCapacity = 500,
            CurrentOccupancy = 100
        };

        await _dbContext.StorageAreas.AddAsync(storage);
        await _dbContext.SaveChangesAsync();

        var invalidDto = new StorageAreaUpdateDto
        {
            Type = StorageAreaType.ContainerYard,
            Location = "Sector D",
            MaxCapacity = 300,
            CurrentOccupancy = 400 // exceeds
        };

        // Act
        var result = await _controller.UpdateAsync(storage.Code, invalidDto);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }
    
    [Test]
    public async Task UpdateAsync_WhenStorageNotFound_ShouldReturnNotFound()
    {
        // Arrange
        var dto = new StorageAreaUpdateDto
        {
            Type = StorageAreaType.Warehouse,
            Location = "Sector Z",
            MaxCapacity = 1000,
            CurrentOccupancy = 100
        };

        // Act
        var result = await _controller.UpdateAsync("SA-999", dto);

        // Assert
        result.Should().BeOfType<NotFoundObjectResult>();
    }
}
