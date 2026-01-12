using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Services;

[TestFixture]
public class OperationPlanServiceTests
{
    private IOperationPlanService _operationPlanService;
    private IStaffService _staffService;
    private IStaffRepository _staffRepository;
    private IQualificationRepository _qualificationRepository;
    private IMapper _mapper;
    private IShiftRepository _shiftRepository;
    private IResourceRepository _resourceRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _staffRepository = new StaffRepository(_dbContext);
        _resourceRepository = new ResourceRepository(_dbContext);
        
        var config = new TypeAdapterConfig();
        config.Scan(typeof(ShiftMapper).Assembly);
        _mapper = new Mapper(config);
        
        _shiftRepository = new ShiftRepository(_dbContext);
        _qualificationRepository = new QualificationRepository(_dbContext);
        _staffService = new StaffService(_staffRepository, _mapper, _qualificationRepository,  _resourceRepository, _shiftRepository);
        _operationPlanService = new OperationPlanService(_staffService, _staffRepository, _resourceRepository);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task ValidateUpdateOperationPlanCommand_StartIsGreaterThanEndDate_ShouldThrowError()
    {
        // Arrange
        const int vvnCode = 1483;
        var start = DateTime.Parse("2026-01-02T12:45:00");
        var end = DateTime.Parse("2026-01-02T11:30:00");
        var command = new UpdateOperationPlanCommandProvider()
            .WithStart(start)
            .WithEnd(end)
            .Provide();
        
        // Act 
        var ex = Assert.ThrowsAsync<Exception>(async () => 
            await _operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode, command)
        );

        // Assert
        Assert.That(ex.Message, Is.EqualTo("The start time must begin before the end time!"));
    }

    [Test]
    public async Task ValidateUpdateOperationPlanCommand_ChangeEndToLaterWhenStaffIsUnavailable_ShouldThrowError()
    {
        // Arrange
        int[] vvnCode = [19329];
        var shiftStart = DateTime.Parse("2025-12-30T10:00:00");
        var shiftEnd = DateTime.Parse("2025-12-30T15:00:00");
        var resource = new ResourceProvider().Provide();
        var staffMember = new StaffMemberProvider().Provide();
        var shift = new ShiftProvider()
            .WithStaffMember(staffMember)
            .WithFrom(shiftStart)
            .WithTo(shiftEnd)
            .Provide();
        var command = new UpdateOperationPlanCommandProvider()
            .WithCraneCodes([resource.AlphanumericCode])
            .WithStaffCodes([staffMember.MecanographicNumber])
            .WithStart(shiftStart)
            .WithEnd(shiftEnd.AddHours(1))
            .Provide();

        command.PlannedOperations.First().Start = shiftStart;
        command.PlannedOperations.Last().End = shiftEnd;

        await _dbContext.Resources.AddAsync(resource);
        await _dbContext.StaffMembers.AddAsync(staffMember);
        await _dbContext.Shifts.AddAsync(shift);
        await _dbContext.SaveChangesAsync();
        
        // Act 
        var ex = Assert.ThrowsAsync<Exception>(async () => 
            await _operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode[0], command)
        );

        // Assert
        Assert.That(ex.Message, Is.EqualTo($"{staffMember.Name} is not doing a shift from {command.Start} to {command.End}!"));
    }
    
    [Test]
    public async Task
        ValidateUpdateOperationPlanCommand_ChangeStaffWhenStaffDoesNotHaveShiftAtThatTime_ShouldThrowError()
    {
        // Arrange
        const int vvnCode = 12302;
        var shiftStart = DateTime.Parse("2025-12-30T10:00:00");
        var shiftEnd = DateTime.Parse("2025-12-30T15:00:00");
        var staffMember = new StaffMemberProvider().Provide(); 
        var resource = new ResourceProvider().Provide();
        var command = new UpdateOperationPlanCommandProvider()
            .WithCraneCodes([resource.AlphanumericCode])
            .WithStaffCodes([staffMember.MecanographicNumber])
            .WithStart(shiftStart)
            .WithEnd(shiftEnd.AddHours(1))
            .Provide();
        
        command.PlannedOperations.First().Start = shiftStart;
        command.PlannedOperations.Last().End = shiftEnd;
        
        await _dbContext.StaffMembers.AddAsync(staffMember);
        await _dbContext.Resources.AddAsync(resource);
        await _dbContext.SaveChangesAsync();
        
        // Act 
        var ex = Assert.ThrowsAsync<Exception>(async () => 
            await _operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode, command)
        );

        // Assert
        Assert.That(ex.Message, Is.EqualTo($"{staffMember.Name} is not doing a shift from {command.Start} to {command.End}!"));
    }

    [Test]
    public async Task ValidateOperationPlanCommand_AllDataIsCorrect_ShouldNotThrowError()
    {
        // Arrange
        const int vvnCode = 19329;
        const int extraMinutes = 1;
        var shiftStart = DateTime.Parse("2026-01-02T07:00:00");
        var shiftEnd = DateTime.Parse("2026-01-02T07:14:00");
        var resource = new ResourceProvider().Provide();
        var staffMember = new StaffMemberProvider().Provide();
        var shift = new ShiftProvider()
            .WithResource(resource)
            .WithStaffMember(staffMember)
            .WithFrom(shiftStart)
            .WithTo(shiftEnd)
            .Provide();
        var command = new UpdateOperationPlanCommandProvider()
            .WithCraneCodes([resource.AlphanumericCode])
            .WithStaffCodes([staffMember.MecanographicNumber])
            .WithStart(shiftStart.AddMinutes(extraMinutes))
            .WithEnd(shiftEnd)
            .Provide();

        command.PlannedOperations.First().Start = shiftStart.AddMinutes(extraMinutes);

        await _dbContext.Resources.AddAsync(resource);
        await _dbContext.StaffMembers.AddAsync(staffMember);
        await _dbContext.Shifts.AddAsync(shift);
        await _dbContext.SaveChangesAsync();

        // Act 
        await _operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode, command);
    }
    
    [Test]
    public async Task ValidateOperationPlanCommand_ThePlannedOperationSequenceIsNotInOrder_ShouldNotThrowError()
    {
        // Arrange
        const int vvnCode = 19329;
        var shiftStart = DateTime.Parse("2025-12-30T10:00:00");
        var shiftEnd = DateTime.Parse("2025-12-30T15:00:00");
        var resource = new ResourceProvider().Provide();
        var staffMember = new StaffMemberProvider().Provide();
        var shift = new ShiftProvider()
            .WithResource(resource)
            .WithStaffMember(staffMember)
            .WithFrom(shiftStart)
            .WithTo(shiftEnd)
            .Provide();
        var command = new UpdateOperationPlanCommandProvider()
            .WithCraneCodes([resource.AlphanumericCode])
            .WithStaffCodes([staffMember.MecanographicNumber])
            .WithStart(shiftStart.AddMinutes(30))
            .WithEnd(shiftEnd)
            .Provide();

        command.PlannedOperations.First().Start = shiftStart.AddMinutes(30);
        command.PlannedOperations.Last().End = shiftEnd;
        command.PlannedOperations[1].Start = command.PlannedOperations[1].Start.AddHours(1);

        await _dbContext.Resources.AddAsync(resource);
        await _dbContext.StaffMembers.AddAsync(staffMember);
        await _dbContext.Shifts.AddAsync(shift);
        await _dbContext.SaveChangesAsync();

        // Act 
        var ex = Assert.ThrowsAsync<Exception>(async () => 
            await _operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode, command)
        );

        // Assert
        Assert.That(ex.Message, Is.EqualTo("The planned operation sequence is not in order!"));
    }
}