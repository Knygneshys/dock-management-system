using FluentAssertions;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.StaffDTOs;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;

[TestFixture]
public class StaffControllerTests
{
    private JWPDbContext _dbContext;
    private StaffRepository _repository;
    private IMapper _mapper;
    private StaffService _service;
    private StaffMembersController _controller;
    private QualificationRepository _qualificationRepository;
    private ResourceRepository _resourceRepository;
    private ShiftRepository _shiftRepository;

    private readonly StaffMemberProvider _staffProvider = new();
    private readonly OperationalWindowProvider _operationalWindowProvider = new();

    [SetUp]
    public async Task SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repository = new StaffRepository(_dbContext);
        _mapper = new Mapper();
        _qualificationRepository = new QualificationRepository(_dbContext);
        _resourceRepository = new ResourceRepository(_dbContext);
        _shiftRepository = new ShiftRepository(_dbContext);
        _service = new StaffService(_repository, _mapper, _qualificationRepository, _resourceRepository, _shiftRepository);

        await _dbContext.Qualifications.AddAsync(new Qualification
        {
            Id = Guid.NewGuid(),
            Code = "DRL",
            Name = "Driving License"
        });
        await _dbContext.SaveChangesAsync();

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
                x => x.UserIsAuthorizedByAuth0IdAsync(
                    It.IsAny<string>(),
                    It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<StaffMembersController>.Instance;

        _controller = new StaffMembersController(
            _repository,
            _mapper,
            _service, 
            _qualificationRepository, 
            _shiftRepository,
            mockAuthService.Object,
            logger)
        { 
            ControllerContext = AuthHelper.CreateControllerContextWithUser() 
        }; 
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    #region Staff Tests

    [Test]
    public async Task CreateAsync_ValidStaff_ShouldReturnCreatedCode()
    {
        var dto = _staffProvider.WithQualificationCode("DRL").ProvideCreateDto();

        var result = _controller.CreateAsync(dto).Result;

        result.Should().NotBeNull();

        var created = await _dbContext.StaffMembers.FirstOrDefaultAsync(s => s.Email.Equals(dto.Email));
        created.Should().NotBeNull();
        created.Name.Should().Be(dto.Name);
    }

    [Test]
    public async Task GetAllAsync_ShouldReturnAllStaff()
    {
        var staffList = _staffProvider.ProvideList();
        await _dbContext.StaffMembers.AddRangeAsync(staffList);
        await _dbContext.SaveChangesAsync();

        var result = await _controller.GetAllAsync();

        var ok = result.Result as OkObjectResult;
        ok.Should().NotBeNull();
        var list = ok!.Value as List<StaffDTO>;
        list.Should().NotBeNull();
        list!.Count.Should().Be(staffList.Count);
    }

    [Test]
    public async Task UpdateAsync_ExistingStaff_ShouldReturnOkAndUpdate()
    {
        var staff = _staffProvider.Provide();
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        var updatedDto = _staffProvider
            .WithMecanographicNumber(staff.MecanographicNumber)
            .ProvideUpdateDto();
        updatedDto.Email = "updated@mail.com";

        var result = await _controller.UpdateAsync(staff.MecanographicNumber, updatedDto);

        result.Should().BeOfType<OkResult>();
        var updated = await _dbContext.StaffMembers.FirstAsync(s => s.Id.Equals(staff.Id));
        updated.Email.Should().Be("updated@mail.com");
    }

    [Test]
    public async Task UpdateAsync_NonExistingStaff_ShouldReturnNotFound()
    {
        var dto = _staffProvider.ProvideUpdateDto();

        var result = await _controller.UpdateAsync(43243, dto);

        result.Should().BeOfType<NotFoundResult>();
    }

    [Test]
    public async Task DeactivateAsync_ExistingStaff_ShouldDeactivate()
    {
        var staff = _staffProvider.Provide();
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        var result = await _controller.DeactivateAsync(staff.MecanographicNumber);

        result.Should().BeOfType<OkResult>();
        var updated = await _dbContext.StaffMembers.FirstAsync(s => s.Id.Equals(staff.Id));
        updated.isActive.Should().Be(false);
    }

    [Test]
    public async Task UpdateStatusAsync_ExistingStaff_ShouldUpdateStatus()
    {
        var staff = _staffProvider.WithStatus(StaffStatus.Available).Provide();
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        var result = await _controller.UpdateStatusAsync(staff.MecanographicNumber, StaffStatus.OnLeave);

        result.Should().BeOfType<OkResult>();
        var updated = await _dbContext.StaffMembers.FirstAsync(s => s.Id.Equals(staff.Id));
        updated.Status.Should().Be(StaffStatus.OnLeave);
    }

    [Test]
    public async Task GetBySearchAsync_ShouldReturnFilteredStaff()
    {
        var staffList = new List<StaffMember>
        {
            new StaffMemberProvider().WithMecanographicNumber(101).Provide(),
            new StaffMemberProvider().WithMecanographicNumber(102).Provide(),
            new StaffMemberProvider().WithMecanographicNumber(103).Provide()
        };

        staffList[0].Name = "Alice";
        staffList[1].Name = "Bob";
        staffList[2].Name = "Charlie";

        await _dbContext.StaffMembers.AddRangeAsync(staffList);
        await _dbContext.SaveChangesAsync();

        var result = await _controller.GetBySearchAsync("a", null, null, null, "contains");

        var ok = result.Result as OkObjectResult;
        ok.Should().NotBeNull();
        var list = ok!.Value as IEnumerable<StaffDTO>;
        list.Should().NotBeNull();
        list!.Count().Should().Be(2);
    }

    #endregion

    #region OperationalWindow Tests

    [Test]
    public async Task CreateOperationalWindowAsync_ValidData_ShouldCreateWindow()
    {
        var staff = _staffProvider.WithMecanographicNumber(5001).Provide();
        await _dbContext.StaffMembers.AddAsync(staff);
        await _dbContext.SaveChangesAsync();

        var dto = _operationalWindowProvider
            .WithDayOfWeek(DayOfWeek.Monday)
            .ProvideDto();

        var result = await _controller.CreateOperationalWindowAsync(staff.MecanographicNumber,dto);

        result.Should().BeOfType<OkResult>();
        var ok = result as OkResult;

        var created = await _dbContext.OperationalWindows.FirstOrDefaultAsync();
        created.Should().NotBeNull();
        created!.StaffMemberId.Should().Be(staff.Id);
        created.DayOfWeek.Should().Be(DayOfWeek.Monday);
    }

    [Test]
    public async Task CreateOperationalWindowAsync_StaffNotFound_ShouldThrowException()
    {
        var dto = _operationalWindowProvider
            .ProvideDto();

        var act = await _controller.CreateOperationalWindowAsync(9999,dto);

        act.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    [Test]
    public async Task DeactivateAsync_NonExistingStaff_ShouldReturnNotFound()
    {
        // Arrange

        // Act
        var result = await _controller.DeactivateAsync(99999);

        // Assert
        result.Should().BeOfType<NotFoundResult>();
    }

    [Test]
    public async Task GetBySearchAsync_InvalidOperatorType_ShouldReturnBadRequest()
    {
        // Arrange
        var staffList = _staffProvider.ProvideList();
        await _dbContext.StaffMembers.AddRangeAsync(staffList);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _controller.GetBySearchAsync("Alice", null, null, null, "invalidType");

        // Assert
        result.Result.Should().BeOfType<BadRequestResult>();
    }

}
