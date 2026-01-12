using FluentAssertions;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.ResourceDTOs;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;
internal class ResourceControllerTests
{
    private JWPDbContext _dbContext;
    private ResourceRepository _repository;
    private IMapper _mapper;
    private QualificationRepository _qualificationRepository;
    private IResourceService _resourceService;
    private ResourcesController controller;
    private DockRecordRepository _dockRecordRepository;
    private StorageAreaRepository _storageAreaRepository;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repository = new ResourceRepository(_dbContext);
        _mapper = new Mapper();
        _qualificationRepository = new QualificationRepository(_dbContext);
        _resourceService = new ResourceService(_repository);
        _dockRecordRepository = new DockRecordRepository(_dbContext);
        _storageAreaRepository = new StorageAreaRepository(_dbContext);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<ResourcesController>.Instance;

        controller = new ResourcesController(
            _repository,
            _qualificationRepository,
            _dockRecordRepository,
            _storageAreaRepository,
            _mapper,
           _resourceService,
           mockAuthService.Object,
           logger)
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_AuthorizedUser_CreatesResource()
    {
        // Arrange
        var resourceDTO = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.TerminalTruck,
            AlphanumericCode = "TT-1001",
            Description = "Test Terminal Truck"
        };
        // Act
        var result = await controller.CreateAsync(resourceDTO);
        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Test]
    public async Task CreateAsync_InvalidResourceType_ReturnsBadRequest()
    {
        // Arrange
        var resourceDTO = new ResourceCreateDTO
        {
            ResourceType = (ResourceTypes)999, // Invalid type
            AlphanumericCode = "TT-1003",
            Description = "Test Terminal Truck"
        };
        // Act
        var result = await controller.CreateAsync(resourceDTO);
        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Test]
    public async Task GetByCodeAsync_AuthorizedUser_ReturnsResource()
    {
        // Arrange
        var resourceDTO = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.TerminalTruck,
            AlphanumericCode = "TT-1004",
            Description = "Test Terminal Truck"
        };
        await controller.CreateAsync(resourceDTO);
        // Act
        var result = await controller.GetByCodeAsync("TT-1004");
        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
    }

    [Test]
    public async Task GetByCodeAsync_NonExistentCode_ReturnsNotFound()
    {
        // Arrange
        // Act
        var result = await controller.GetByCodeAsync("NON-EXISTENT");
        // Assert
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Test]
    public async Task GetByFilterAsync_AuthorizedUser_ReturnsFilteredResources()
    {
        // Arrange
        var dock = new DockRecordProvider().Provide();
        await _dockRecordRepository.CreateAsync(dock);
        var resourceDTO1 = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.TerminalTruck,
            AlphanumericCode = "TT-1005",
            Description = "Test Terminal Truck 1"
        };
        var resourceDTO2 = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.STSCrane,
            AlphanumericCode = "STSC-1001",
            Description = "Test STS Crane",
            DockRecordCode = dock.Code
        };
        await controller.CreateAsync(resourceDTO1);
        await controller.CreateAsync(resourceDTO2);
        // Act
        var result = await controller.GetByFilterAsync("Test STS Crane", null, null);
        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult.Should().NotBeNull();
    }

    [Test]
    public async Task ReactivateAsync_AuthorizedUser_ReactivatesResource()
    {
        // Arrange
        var resourceDTO = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.TerminalTruck,
            AlphanumericCode = "TT-1006",
            Status = ResourceStatus.Inactive,
            Description = "Test Terminal Truck"
        };
        await controller.CreateAsync(resourceDTO);
        // Act
        var result = await controller.ReactivateAsync("TT-1006");
        // Assert
        result.Should().BeOfType<OkResult>();
    }

    [Test]
    public async Task ReactivateAsync_NonExistentCode_ReturnsNotFound()
    {
        // Arrange
        // Act
        var result = await controller.ReactivateAsync("NON-EXISTENT");
        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Test]
    public async Task ReactivateAsync_AlreadyActiveReasource_BadRequest()
    {
        // Arrange
        var resourceDTO = new ResourceCreateDTO
        {
            ResourceType = ResourceTypes.TerminalTruck,
            AlphanumericCode = "TT-1007",
            Description = "Test Terminal Truck"
        };
        await controller.CreateAsync(resourceDTO);
        // Act
        var result = await controller.ReactivateAsync("TT-1007");
        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }
}
