using FluentAssertions;
using JadeWesserPort;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.OperationalWindowDTOs;
using JadeWesserPort.DTOs.ShiftDTOs;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Services;

[TestFixture]
public class StaffServiceTests
{
    private JWPDbContext _dbContext;
    private StaffRepository _repository;
    private IMapper _mapper;
    private StaffService _service;
    private QualificationRepository _qualificationRepository;
    private ResourceRepository _resourceRepository;
    private ShiftRepository _shiftRepository;
    private StaffMembersController _staffController;
    private ShiftRepository _shiftsRepo;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repository = new StaffRepository(_dbContext);
        var config = new TypeAdapterConfig();
        config.Apply(new ShiftMapper());
        config.Apply(new OperationalWindowMapper());
        _mapper = new Mapper(config);
        _qualificationRepository = new QualificationRepository(_dbContext);
        _resourceRepository = new ResourceRepository(_dbContext);
        _shiftRepository = new ShiftRepository(_dbContext);
        _qualificationRepository = new QualificationRepository(_dbContext);
        _shiftsRepo = new ShiftRepository(_dbContext);
        _service = new StaffService(_repository, _mapper, _qualificationRepository, _resourceRepository,
            _shiftRepository);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<StaffMembersController>.Instance;

        _staffController = new StaffMembersController(_repository, _mapper, _service, _qualificationRepository, _shiftsRepo,
                mockAuthService.Object, logger)
            { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task GetBySearchAsync_NameContains_ShouldReturnFilteredResults()
    {
        // Arrange
        var staff = new List<StaffMember>
        {
            new() { Id = Guid.NewGuid(), Name = "Alice", MecanographicNumber = 101 },
            new() { Id = Guid.NewGuid(), Name = "Bob", MecanographicNumber = 102 },
            new() { Id = Guid.NewGuid(), Name = "Charlie", MecanographicNumber = 103 }
        };
        await _dbContext.StaffMembers.AddRangeAsync(staff);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetBySearchAsync("a", null, null, null, "contains");

        // Assert
        result.Should().HaveCount(2); // Alice + Charlie
    }

    [Test]
    public async Task GetBySearchAsync_NameEquals_ShouldReturnExactMatch()
    {
        // Arrange
        var staff = new StaffMember { Id = Guid.NewGuid(), Name = "Maria", MecanographicNumber = 500 };
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetBySearchAsync("Maria", null, null, null, "equals");

        // Assert
        result.Should().ContainSingle(r => r.Name == "Maria");
    }

    [Test]
    public async Task GetBySearchAsync_ByStatus_ShouldReturnMatchingStaff()
    {
        // Arrange
        var alice = new StaffMemberProvider().Provide();
        alice.Name = "Alice";
        alice.Status = StaffStatus.Available;
    
        var bob = new StaffMemberProvider().Provide();
        bob.Name = "Bob";
        bob.Status = StaffStatus.Unavailable;

        await _dbContext.StaffMembers.AddRangeAsync([alice, bob]);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _service.GetBySearchAsync(null, null, StaffStatus.Available, null, "equals");

        // Assert
        result.Should().ContainSingle(r => r.Name == "Alice");
    }

    [Test]
    public async Task CreateShiftAsync_CorrectData_ReturnDto()
    {
        //Arrange
        var resourceCode = "RTC";
        var qualificationCode = "QT";
        var staffNumber = 12345;
        var shiftCreateDto = new ShiftCreateDto()
        {
            Day = 29,
            Month = 10,
            Year = 2025,
            FromHour = 12,
            FromMinute = 30,
            ToHour = 19,
            ToMinute = 20,
            ResourceCode = resourceCode
        };

        var operationalWindowDto = new OperationalWindowFormDTO()
        {
            DayOfWeek = DayOfWeek.Wednesday,
            StartHour = 10,
            StartMinute = 0,
            EndHour = 20,
            EndMinute = 0
        };

        var qualification = new QualificationProvider().WithCode(qualificationCode).Provide();
        await _qualificationRepository.CreateAsync(qualification);
        var resource = new ResourceProvider().WithAlphanumericCode(resourceCode).WithQualification(qualification).Provide();
        await _resourceRepository.CreateAsync(resource);
        var staff = new StaffMemberProvider().WithMecanographicNumber(staffNumber).WithQualificationCode(qualificationCode).ProvideCreateDto();
        await _service.CreateAsyncService(staff);
        await _staffController.CreateOperationalWindowAsync(staffNumber, operationalWindowDto);

        //Act
        var result = await _service.CreateShiftAsync(staffNumber, shiftCreateDto);

        //Assert
        result.Should().NotBeNull();
        result.StaffMNumber.Should().Be(staffNumber);
        result.ResourceCode.Should().Be(resourceCode);
    }

    [Test]
    public async Task CreateShiftAsync_StaffNotWorking_ReturnNull()
    {
        //Arrange
        var resourceCode = "RTC";
        var qualificationCode = "QT";
        var staffNumber = 12345;
        var shiftCreateDto = new ShiftCreateDto()
        {
            Day = 29, //It's on Wednesday
            Month = 10,
            Year = 2025,
            FromHour = 10,
            FromMinute = 0,
            ToHour = 11,
            ToMinute = 30,
            ResourceCode = resourceCode
        };

        var operationalWindowDto = new OperationalWindowFormDTO()
        {
            DayOfWeek = DayOfWeek.Monday,
            StartHour = 10,
            StartMinute = 0,
            EndHour = 17,
            EndMinute = 0
        };

        var qualification = new QualificationProvider().WithCode(qualificationCode).Provide();
        await _qualificationRepository.CreateAsync(qualification);
        var resource = new ResourceProvider().WithAlphanumericCode(resourceCode).WithQualification(qualification).Provide();
        await _resourceRepository.CreateAsync(resource);
        var staff = new StaffMemberProvider().WithMecanographicNumber(staffNumber).WithQualificationCode(qualificationCode).ProvideCreateDto();
        await _service.CreateAsyncService(staff);
        await _staffController.CreateOperationalWindowAsync(staffNumber, operationalWindowDto);

        //Act
        var result = await _service.CreateShiftAsync(staffNumber, shiftCreateDto);

        //Assert
        result.Should().BeNull();
    }

    [Test]
    public async Task CreateShiftAsync_NoResourceAvailable_ThrowException()
    {
        //Arrange
        var resourceCode = "RTC";
        var qualificationCode = "QT";
        var staffNumber = 12345;
        var shiftCreateDto = new ShiftCreateDto()
        {
            Day = 29, //It's on Wednesday
            Month = 10,
            Year = 2025,
            FromHour = 10,
            FromMinute = 0,
            ToHour = 11,
            ToMinute = 30,
            ResourceCode = resourceCode
        };

        var operationalWindowDto = new OperationalWindowFormDTO()
        {
            DayOfWeek = DayOfWeek.Wednesday,
            StartHour = 10,
            StartMinute = 0,
            EndHour = 17,
            EndMinute = 0
        };

        var qualification = new QualificationProvider().WithCode(qualificationCode).Provide();
        await _qualificationRepository.CreateAsync(qualification);
        var resource = new ResourceProvider().WithAlphanumericCode(resourceCode).WithQualification(qualification).Provide();
        await _resourceRepository.CreateAsync(resource);
        var staff = new StaffMemberProvider().WithMecanographicNumber(staffNumber).WithQualificationCode(qualificationCode).ProvideCreateDto();
        await _service.CreateAsyncService(staff);
        await _staffController.CreateOperationalWindowAsync(staffNumber, operationalWindowDto);
        var result = await _service.CreateShiftAsync(staffNumber, shiftCreateDto);

        //Act
        shiftCreateDto = new ShiftCreateDto()
        {
            Day = 29, //Same day
            Month = 10,
            Year = 2025,
            FromHour = 11, //Time overlap
            FromMinute = 0,
            ToHour = 11,
            ToMinute = 20,
            ResourceCode = resourceCode
        };

        //Assert
        Assert.ThrowsAsync<ArgumentException>(async () => await _service.CreateShiftAsync(staffNumber, shiftCreateDto));
    }
}
