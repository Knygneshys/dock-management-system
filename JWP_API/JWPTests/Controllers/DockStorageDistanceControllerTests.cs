using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers
{
    [TestFixture]
    public class DockStorageDistanceControllerTests
    {
        private DockStorageDistancesController _controller;
        private IDockStorageDistanceRepository _distanceRepository;
        private IDockRecordRepository _dockRepository;
        private IStorageAreaRepository _storageRepository;
        private IMapper _mapper;
        private JWPDbContext _dbContext;

        [SetUp]
        public void SetUp()
        {
            _dbContext = JwpInMemoryDbContext.GetContext();
            _distanceRepository = new DockStorageDistanceRepository(_dbContext);
            _dockRepository = new DockRecordRepository(_dbContext);
            _storageRepository = new StorageAreaRepository(_dbContext);
            _mapper = new Mapper(new TypeAdapterConfig());

            var mockAuthService = new Mock<IAuthService>();
            mockAuthService.Setup(
                x => x.UserIsAuthorizedByAuth0IdAsync(
                    It.IsAny<string>(),
                    It.IsAny<UserRole>()))
                .ReturnsAsync(true);

            var logger = NullLogger<DockStorageDistancesController>.Instance;

            _controller = new DockStorageDistancesController(
                _distanceRepository,
                _dockRepository,
                _storageRepository,
                mockAuthService.Object,
                _mapper,
                logger)
            { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
        }

        [TearDown]
        public async Task TearDown() => await _dbContext.DisposeAsync();

        [Test]
        public async Task CreateAsync_GivenValidData_ShouldPersistDockStorageDistance()
        {
            // Arrange
            var dock = new DockRecordProvider().Provide();
            var storage = new StorageAreaProvider().Provide();

            await _dbContext.DockRecords.AddAsync(dock);
            await _dbContext.StorageAreas.AddAsync(storage);
            await _dbContext.SaveChangesAsync();

            var dto = new DockStorageDistanceDto
            {
                Code = "DIST-001",
                DockCode = dock.Code,
                StorageAreaCode = storage.Code,
                DistanceMeters = 123.4,
                Notes = "Test entry"
            };

            // Act
            var result = await _controller.CreateAsync(dto);

            // Assert
            using (new AssertionScope())
            {
                result.Should().BeOfType<ActionResult<string>>();
                var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
                okResult.Value.Should().Be("DIST-001");

                var created = await _dbContext.DockStorageDistances.FirstOrDefaultAsync();
                created.Should().NotBeNull();
                created!.DistanceMeters.Should().Be(123.4);
            }
        }
    }
}
