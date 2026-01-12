using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class VesselTypeRepositoryTests
{
    private IVesselTypeRepository _vesselTypeRepository;
    private JWPDbContext _dbContext;
    
    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _vesselTypeRepository = new VesselTypeRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    // MethodName_StateUnderTest_ExpectedBehavior
    public async Task CreateAsync_CorrectDataGiven_ReturnCreatedVesselTypesCode()
    {
        // Arrange
        var code = "Code";
        var vesselType = new VesselTypeProvider()
            .WithCode(code)
            .Provide();
        
        // Act
        var resultCode = await _vesselTypeRepository.CreateAsync(vesselType);
        
        // Assert
        var resultVesselType =
            await _dbContext.VesselTypes.FirstOrDefaultAsync(vt => vt.Code.Equals(code));
        using (new AssertionScope())
        {
            resultCode.Should().Be(code);
            resultVesselType.Should().BeEquivalentTo(vesselType);
        }
    }

    [Test]
    public async Task CreateAsync_DuplicateCodeGiven_ShouldNotCreateVesselType()
    {
        // Arrange
        var code = "dupe";
        var vesselType1 = new VesselTypeProvider()
            .WithCode(code)
            .Provide();
        var vesselType2 = new VesselTypeProvider()
            .WithCode(code)
            .Provide();
        
        await _vesselTypeRepository.CreateAsync(vesselType1);

        // Act

        // Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () => await _vesselTypeRepository.CreateAsync(vesselType2));
    }

    [Test]
    public async Task FindByCodeAsync_CorrectDataGiven_ShouldReturnVesselTypeById()
    {
        // Arrange
        var code = "VT1";
        var vesselType = new VesselTypeProvider()
            .WithCode(code)
            .Provide();

        await _dbContext.VesselTypes.AddAsync(vesselType);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var result = await _vesselTypeRepository.FindByCodeAsync(code);
        
        // Assert
        result.Should().BeEquivalentTo(vesselType);
    }

    [Test]
    public async Task FindByCodeAsync_NonExistentCodeGiven_ShouldReturnNull()
    {
        // Arrange
        var code = "none";
        var vesselType = new VesselTypeProvider().Provide();

        await _dbContext.VesselTypes.AddAsync(vesselType);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var result = await _vesselTypeRepository.FindByCodeAsync(code);
        
        // Assert
        result.Should().BeNull();
    }

    [Test]
    public async Task GetAllAsync_MethodCalled_ShouldReturnListOfVesselTypes()
    {
        // Arrange
        var vesselTypes = new VesselTypeProvider().ProvideList();

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselTypeRepository.GetAllAsync();
        
        // Assert
        results.Should().BeEquivalentTo(vesselTypes);
    }

    [Test]
    public async Task UpdateAsync_GiveACodeOfAExistingVesselType_ShouldUpdateExistingVesselType()
    {
        // Arrange
        var code = "TestCode";
        const string updatedName = "NewName";
        var vesselType = new VesselTypeProvider()
            .WithCode(code)
            .Provide();

        await _dbContext.VesselTypes.AddAsync(vesselType);
        await _dbContext.SaveChangesAsync();

        var vesselTypeDto = new VesselTypeProvider().ProvideUpdateDto();
        vesselTypeDto.Name = updatedName;
        // Act
        var result = await _vesselTypeRepository.UpdateAsync(code, vesselTypeDto);
        
        // Assert
        var updatedVesselType = await _dbContext.VesselTypes.FirstOrDefaultAsync(vt => vt.Code.Equals(code));
        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result.Name.Should().BeEquivalentTo(updatedName);
            updatedVesselType.Should().NotBeNull();
            updatedVesselType.Id.Should().Be(vesselType.Id);
            updatedVesselType.Name.Should().BeEquivalentTo(updatedName);
            updatedVesselType.Description.Should().BeEquivalentTo(vesselType.Description);
            updatedVesselType.Capacity.Should().Be(vesselType.Capacity);
            updatedVesselType.MaxBays.Should().Be(vesselType.MaxBays);
            updatedVesselType.MaxRows.Should().Be(vesselType.MaxRows);
            updatedVesselType.MaxTiers.Should().Be(vesselType.MaxTiers);
        }
    }

    [Test]
    public async Task UpdateAsync_ProvideNonExistentCode_ShouldReturnNull()
    {
        // Arrange
        var code = "noExist";
        const string updatedName = "NewName";
        var vesselType = new VesselTypeProvider().Provide();

        await _dbContext.VesselTypes.AddAsync(vesselType);
        await _dbContext.SaveChangesAsync();

        var vesselTypeDto = new VesselTypeProvider().ProvideUpdateDto();
        vesselTypeDto.Name = updatedName;
        // Act
        var result = await _vesselTypeRepository.UpdateAsync(code, vesselTypeDto);
        
        // Assert
        result.Should().BeNull();
    }
}