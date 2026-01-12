using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Providers;

namespace JWPTests.Services;

[TestFixture]
public class VesselTypeServicesTests
{
    private IVesselTypeService _vesselTypeService;
    private JWPDbContext _dbContext;
    
    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        IVesselTypeRepository _vesselTypeRepository = new VesselTypeRepository(_dbContext);
        _vesselTypeService = new VesselTypeService(_vesselTypeRepository);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task GetBySearchAsync_SearchByNameWithContainsOperator_ShouldReturnListOfVesselTypesThatContainName()
    {
        // Arrange
        const string name = "Tanker";
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string nameContainingWordTanker1 = "Oil tanker";
        const string nameContainingWordTanker2 = "Gas tanker";
        const string nameWithoutWordTanker = "Submarine";
        List<VesselType> vesselTypes =
        [
            new VesselTypeProvider().WithCode("VT1").WithName(nameContainingWordTanker1).Provide(),
            new VesselTypeProvider().WithCode("VT2").WithName(nameContainingWordTanker2).Provide(),
            new VesselTypeProvider().WithCode("VT3").WithName(nameWithoutWordTanker).Provide(),
        ];

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselTypeService.GetBySearchAsync(name, "", filterOperator);
        
        // Assert
        const int expectedCount = 2;
        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.FirstOrDefault().Name.Should().Be(nameContainingWordTanker1);
            results.LastOrDefault().Name.Should().Be(nameContainingWordTanker2);
        }
    }

    [Test]
    public async Task GetBySearchAsync_SearchByNameWithEqualsOperator_ShouldReturnVesselTypesThatHaveEqualName()
    {
        // Arrange
        const string name = "tanker";
        const FilterOperator filterOperator = FilterOperator.Equals;
        const string equalName = "Tanker";
        const string randomName = "Submarine";
        List<VesselType> vesselTypes =
        [
            new VesselTypeProvider().WithCode("VT5").WithName(equalName).Provide(),
            new VesselTypeProvider().WithCode("VT6").WithName(randomName).Provide(),
        ];

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselTypeService.GetBySearchAsync(name, "", filterOperator);
        
        // Assert
        const int expectedCount = 1;
        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.FirstOrDefault().Name.Should().Be(equalName);
        }
    }

    [Test]
    public async Task
        GetBySearchAsync_SearchByDescriptionWithContainsOperator_ShouldReturnVesselTypesThatContainDescription()
    {
        // Arrange
        const string description = "Big ship";
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string descriptionThatContainsFilterWords1 = "Even the big ships will be scared of this one";
        const string descriptionThatContainsFilterWords2 = "This is a big ships";
        const string randomDescription = "A very fast and big vessel";
        List<VesselType> vesselTypes =
        [
            new VesselTypeProvider().WithCode("VT7").WithDescription(descriptionThatContainsFilterWords1).Provide(),
            new VesselTypeProvider().WithCode("VT8").WithDescription(descriptionThatContainsFilterWords2).Provide(),
            new VesselTypeProvider().WithCode("VT9").WithName(randomDescription).Provide(),
        ];

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselTypeService.GetBySearchAsync("", description, filterOperator);
        
        // Assert
        const int expectedCount = 2;
        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.FirstOrDefault().Description.Should().Be(descriptionThatContainsFilterWords1);
            results.LastOrDefault().Description.Should().Be(descriptionThatContainsFilterWords2);
        }
    }

    [Test]
    public async Task
        GetBySearchAsync_SearchByDescriptionWithEqualsOperator_ShouldReturnVesselTypesWithEqualDescriptions()
    {
        // Arrange
        const string description = "tanker vessel";
        const FilterOperator filterOperator = FilterOperator.Equals;
        const string equalDescription = "Tanker vessel";
        const string randomDescription = "Tankers are the best";
        List<VesselType> vesselTypes =
        [
            new VesselTypeProvider().WithCode("VT10").WithDescription(equalDescription).Provide(),
            new VesselTypeProvider().WithCode("VT11").WithDescription(randomDescription).Provide(),
        ];

        await _dbContext.VesselTypes.AddRangeAsync(vesselTypes);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselTypeService.GetBySearchAsync("", description, filterOperator);
        
        // Assert
        const int expectedCount = 1;
        using (new AssertionScope())
        {
            results.Should().HaveCount(expectedCount);
            results.FirstOrDefault().Description.Should().Be(equalDescription);
        }
    }
}