using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.VesselDTOs;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using JWPTests.Providers;
using JWPTests.Services;
using JWPTests.Services.Interfaces;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;

[TestFixture]
public class VesselControllerTests
{
    private VesselsController _vesselController;
    private ICompanyRepository _companyRepository; 
    private IVesselRepository _vesselRepository;
    private IVesselTypeRepository _vesselTypeRepository;
    private IVesselService _vesselService;
    private IMapper _mapper;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();

        var config = new TypeAdapterConfig();
        config.Apply(new VesselMapper());
        _mapper = new Mapper(config);

        _companyRepository = new CompanyRepository(_dbContext);
        _vesselRepository = new VesselRepository(_dbContext);
        _vesselTypeRepository = new VesselTypeRepository(_dbContext);
        _vesselService = new VesselService(_vesselRepository);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<VesselsController>.Instance;

        _vesselController =
            new VesselsController(
                _companyRepository, 
                _vesselRepository, 
                _vesselTypeRepository, 
                _vesselService, 
                mockAuthService.Object, 
                _mapper, 
                logger)
            { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_GivenCorrectData_ShouldCreateVessel()
    {
        // Arrange
        const string imo = "IMO 1234567";
        var ownerAndOperator = new CompanyProvider().Provide();
        var vesselType = new VesselTypeProvider().Provide();
        var vessel = new VesselProvider()
            .WithImo(imo)
            .WithOwner(ownerAndOperator)
            .WithOperator(ownerAndOperator)
            .WithType(vesselType)
            .Provide();

        var vesselDto = _mapper.Map<VesselCreateDto>(vessel);
        
        await _dbContext.Companies.AddAsync(ownerAndOperator);
        await _dbContext.VesselTypes.AddAsync(vesselType);
        await _dbContext.SaveChangesAsync();
        
        // Act
        await _vesselController.CreateAsync(vesselDto);
        
        // Assert
        var result = await _dbContext.Vessels.FirstOrDefaultAsync();
        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result.OperatorId.Should().Be(vessel.OperatorId);
            result.OwnerId.Should().Be(vessel.OwnerId);
            result.Imo.Should().Be(imo);
            result.Name.Should().Be(vessel.Name);
        }
    }

    [Test]
    public async Task GetAllAsync_DatabaseHasVessels_ShouldReturnAllVessels()
    {
        // Arrange
        var vessels = new VesselProvider().ProvideList();
        
        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselController.GetAllAsync();
        
        // Assert
        using (new AssertionScope())
        {
            var okResult = results.Result.Should().BeOfType<OkObjectResult>().Subject;
            var vesselList = okResult.Value.Should().BeAssignableTo<IEnumerable<VesselDto>>().Subject;
            vesselList.Should().HaveCount(vessels.Count);
        }
    }

    [Test]
    public async Task UpdateAsync_UpdateExistingVesselsName_VesselsNameShouldChange()
    {
        // Arrange
        const string updatedName = "Updated Name";
        var imo = "IMO 1234567";
        var vessel = new VesselProvider().WithImo(imo).Provide();

        await _dbContext.Vessels.AddAsync(vessel);
        await _dbContext.SaveChangesAsync();

        var vesselDto = _mapper.Map<VesselUpdateDto>(vessel);
        vesselDto.Name = updatedName;
        
        // Act
        var result = _vesselController.UpdateAsync(imo, vesselDto).Result;
        
        // Assert
        var vesselFromDatabase = await _dbContext.Vessels.FirstOrDefaultAsync(v => v.Imo.Equals(imo));
        using (new AssertionScope())
        {
            vesselFromDatabase.Should().NotBeNull();
            vesselFromDatabase.Name.Should().Be(updatedName);
            result.Should().NotBeNull();
        }   
    }
}