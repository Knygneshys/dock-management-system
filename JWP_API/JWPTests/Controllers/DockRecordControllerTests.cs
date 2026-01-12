using Castle.Core.Logging;
using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;

[TestFixture]
public class DockRecordControllerTests
{
    private DockRecordsController _dockRecordController;
    private IDockRecordRepository _dockRecordRepository;
    private IDockRecordService _dockRecordService;
    private IMapper _mapper;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();

        var config = new TypeAdapterConfig();
        config.Apply(new DockRecordMapper());
        _mapper = new Mapper(config);

        _dockRecordRepository = new DockRecordRepository(_dbContext);
        _dockRecordService = new DockRecordService(_dockRecordRepository);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<DockRecordsController>.Instance;

        _dockRecordController = new DockRecordsController(
            _dockRecordRepository,
            _dockRecordService,
            mockAuthService.Object,
            _mapper,
            logger
        )
        { ControllerContext = AuthHelper.CreateControllerContextWithUser()};
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_GivenCorrectData_ShouldCreateDockRecord()
    {
        // Arrange
        var dockDto = new DockRecordProvider().ProvideDto();

        // Act
        await _dockRecordController.CreateAsync(dockDto);

        // Assert
        var result = await _dbContext.DockRecords.FirstOrDefaultAsync();
        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result.Name.Should().Be(dockDto.Name);
            result.Location.Should().Be(dockDto.Location);

            ((float?)result.Length).Should().BeApproximately(dockDto.Length, 0.01f);
            ((float?)result.MaxDraft).Should().BeApproximately(dockDto.MaxDraft, 0.01f);
        }
    }

    [Test]
    public async Task GetAllAsync_DatabaseHasDockRecords_ShouldReturnAllDockRecords()
    {
        // Arrange
        var docks = new DockRecordProvider().ProvideList();

        await _dbContext.DockRecords.AddRangeAsync(docks);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _dockRecordController.GetAllAsync();

        // Assert
        using (new AssertionScope())
        {
            var okResult = results.Result.Should().BeOfType<OkObjectResult>().Subject;
            var dockList = okResult.Value.Should().BeAssignableTo<IEnumerable<DockRecordDto>>().Subject;
            dockList.Should().HaveCount(docks.Count);
        }
    }

    [Test]
    public async Task UpdateAsync_UpdateExistingDockRecord_ShouldChangeName()
    {
        // Arrange
        var dockRecord = new DockRecordProvider()
            .WithCode("DCK-001")
            .WithName("Old Dock")
            .Provide();

        await _dbContext.DockRecords.AddAsync(dockRecord);
        await _dbContext.SaveChangesAsync();

        var updatedDto = new DockRecordUpdateDto
        {
            Name = "Updated Dock",
            Location = dockRecord.Location,
            Length = dockRecord.Length,
            Depth = dockRecord.Depth,
            MaxDraft = dockRecord.MaxDraft,
        };

        // Act
        var result = await _dockRecordController.UpdateDockAsync("DCK-001", updatedDto);

        // Assert
        var dockFromDatabase = await _dbContext.DockRecords
            .FirstOrDefaultAsync(d => d.Code == "DCK-001");

        using (new AssertionScope())
        {
            dockFromDatabase.Should().NotBeNull();
            dockFromDatabase.Name.Should().Be("Updated Dock");
            result.Should().NotBeNull();
        }
    }
}
