using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.DTOs.VesselDTOs;
using JadeWesserPort.Mappers;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class VesselRepositoryTests
{
    private IVesselRepository _vesselRepository;
    private IMapper _mapper = null!;
    private JWPDbContext _dbContext;
    
    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();

        var config = new TypeAdapterConfig();
        config.Apply(new VesselMapper());
        _mapper = new Mapper(config);

        _vesselRepository = new VesselRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }
    
    public async Task CreateAsync_CorrectDataGiven_ReturnCreatedVesselImo()
    {
        // Arrange
        var imo = "IMO 1008361";
        var vessel = new VesselProvider()
            .WithImo(imo)
            .Provide();
        
        // Act
        var resultImo = await _vesselRepository.CreateAsync(vessel);
        
        // Assert
        var resultVessel =
            await _dbContext.Vessels.FirstOrDefaultAsync(vt => vt.Imo.Equals(imo));
        using (new AssertionScope())
        {
            resultImo.Should().Be(imo);
            resultVessel.Should().BeEquivalentTo(vessel);
        }
    }
    
    [Test]
    public async Task GetAllAsync_MethodCalled_ShouldReturnListOfVessels()
    {
        // Arrange
        var vessels = new VesselProvider().ProvideList();

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselRepository.GetAllAsync();
        
        // Assert
        results.Should().BeEquivalentTo(vessels);
    }
    
    [Test]
    public async Task UpdateAsync_GiveAnIdOfAExistingVessel_ShouldUpdateExistingVessel()
    {
        // Arrange
        var imo = "IMO 1008362";
        const string updatedName = "NewName";
        var vessel = new VesselProvider()
            .WithImo(imo)
            .Provide();

        await _dbContext.Vessels.AddAsync(vessel);
        await _dbContext.SaveChangesAsync();

        var vesselUpdateDto = _mapper.Map<VesselUpdateDto>(vessel);
        vesselUpdateDto.Name = updatedName;

        // Act
        var result = await _vesselRepository.UpdateAsync(imo, vesselUpdateDto);
        
        // Assert
        var updatedVesselType = await _dbContext.Vessels.FirstOrDefaultAsync(vt => vt.Imo.Equals(imo));
        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result.Name.Should().BeEquivalentTo(updatedName);
        }
    }

    [Test]
    public async Task UpdateAsync_ProvideNonExistentImo_ShouldReturnNull()
    {
        // Arrange
        var imo = "IMO 1008363";
        const string updatedName = "NewName";
        var vessel = new VesselProvider().Provide();

        await _dbContext.Vessels.AddAsync(vessel);
        await _dbContext.SaveChangesAsync();

        var vesselUpdateDto = _mapper.Map<VesselUpdateDto>(vessel);
        vesselUpdateDto.Name = updatedName;

        // Act
        var result = await _vesselRepository.UpdateAsync(imo, vesselUpdateDto);
        
        // Assert
        result.Should().BeNull();
    }
}