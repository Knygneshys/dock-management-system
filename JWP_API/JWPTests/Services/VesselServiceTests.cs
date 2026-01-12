using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JWPTests.Providers;
using JWPTests.Services.Interfaces;

namespace JWPTests.Services;

[TestFixture]
public class VesselServiceTests
{
    private IVesselService _vesselService;
    private IVesselRepository _vesselRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _vesselRepository = new VesselRepository(_dbContext);
        _vesselService = new VesselService(_vesselRepository);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    [TestCase("IMO 9074729")]
    [TestCase("IMO 8814275")]
    [TestCase("IMO 9595321")]
    public void CheckIfImoNumberIsValidAsync_ValidImo_ShouldReturnTrue(string validImo)
    {
        // Arrange
        
        // Act
        var result = _vesselService.CheckIfImoNumberIsValidAsync(validImo);
        
        // Assert
        result.Should().BeTrue();
    }

    [Test]
    public void CheckIfImoNumberIsValidAsync_DoesNotStartWithIMO_ShouldReturnFalse()
    {
        // Arrange
        const string invalidImo = "9074729";
        
        // Act
        var result = _vesselService.CheckIfImoNumberIsValidAsync(invalidImo);
        
        // Assert
        result.Should().BeFalse();
    }
    
    [Test]
    public void CheckIfImoNumberIsValidAsync_TooManyDigits_ShouldReturnFalse()
    {
        // Arrange
        const string invalidImo = "IMO 3882528857";
        
        // Act
        var result =  _vesselService.CheckIfImoNumberIsValidAsync(invalidImo);
        
        // Assert
        result.Should().BeFalse();
    }
    
    [Test]
    public void CheckIfImoNumberIsValidAsync_TooFewDigits_ShouldReturnFalse()
    {
        // Arrange
        const string invalidImo = "IMO 123456";
        
        // Act
        var result =  _vesselService.CheckIfImoNumberIsValidAsync(invalidImo);
        
        // Assert
        result.Should().BeFalse();
    }
    
    [Test]
    public void CheckIfImoNumberIsValidAsync_FailsCheckDigitValidation_ShouldReturnFalse()
    {
        // Arrange
        const string invalidImo = "IMO 1234568";
        
        // Act
        var result = _vesselService.CheckIfImoNumberIsValidAsync(invalidImo);
        
        // Assert
        result.Should().BeFalse();
    }

    [Test]
    public async Task GetByFilterAsync_FilterByImoNumberWithEqualsOperator_ShouldReturnVesselThatEqualsImoNumber()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Equals;
        const string imoFilterQuery = "imo 1234567";
        string imo = imoFilterQuery.ToUpper();
        const string randomImo1 = "IMO 9883417";
        const string randomImo2 = "IMO 7303059";
        List<Vessel> vessels =
        [
            new VesselProvider().WithImo(imo).Provide(),
            new VesselProvider().WithImo(randomImo1).Provide(),
            new VesselProvider().WithImo(randomImo2).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselService.GetByFilterAsync(imoFilterQuery, null, null, filterOperator);
        
        // Assert
        const int expectedVesselCount = 1;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Imo.Should().Be(imo);
        }
    }
    
    [Test]
    public async Task GetByFilterAsync_FilterByImoNumberWithContainsOperator_ShouldReturnVesselsThatContainImoNumber()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string imoFilterQuery = "34";
        const string correctImo1 = "IMO 1234567";
        const string correctImo2 = "IMO 9883417";
        const string randomImo = "IMO 7303059";
        List<Vessel> vessels =
        [
            new VesselProvider().WithImo(correctImo1).Provide(),
            new VesselProvider().WithImo(correctImo2).Provide(),
            new VesselProvider().WithImo(randomImo).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselService.GetByFilterAsync(imoFilterQuery, null, null, filterOperator);
        
        // Assert
        const int expectedVesselCount = 2;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Imo.Should().Be(correctImo1);
            results.Last().Imo.Should().Be(correctImo2);
        }
    }

    [Test]
    public async Task GetByFilterAsync_FilterByNameWithEqualsOperator_ShouldReturnVesselWithEqualNames()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Equals;
        const string name = "Docker";
        const string randomName1 = "Dockerson";
        const string randomName2 = "Docker of Gas";
        List<Vessel> vessels =
        [
            new VesselProvider().WithName(name).Provide(),
            new VesselProvider().WithName(randomName1).Provide(),
            new VesselProvider().WithName(randomName2).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _vesselService.GetByFilterAsync(null, name, null, filterOperator);

        // Assert
        const int expectedVesselCount = 1;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Name.Should().Be(name);
        }
    }
    
    [Test]
    public async Task GetByFilterAsync_FilterByNameWithContainsOperator_ShouldReturnVesselsContainingName()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string name1 = "Docker";
        const string name2 = "Dockerson";
        const string name3 = "Docker of Gas";
        List<Vessel> vessels =
        [
            new VesselProvider().WithName(name1).Provide(),
            new VesselProvider().WithName(name2).Provide(),
            new VesselProvider().WithName(name3).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _vesselService.GetByFilterAsync(null, name1, null, filterOperator);

        // Assert
        const int expectedVesselCount = 3;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Name.Should().Be(name1);
            results.Last().Name.Should().Be(name3);
        }
    }

    [Test]
    public async Task GetByFiltersAsync_FilterByOperatorNameWithEqualsOperator_ShouldReturnVesselsWithEqualOperatorName()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Equals;
        const string operatorName = "Gorum co.";
        const string randomOperatorName1 = "gorum";
        const string randomOperatorName2 = "Gorum co";
        var vesselOperator = new CompanyProvider().WithName(operatorName).Provide();
        var randomVesselOperator1 = new CompanyProvider().WithName(randomOperatorName1).Provide();
        var randomVesselOperator2 = new CompanyProvider().WithName(randomOperatorName2).Provide();

        await _dbContext.Companies.AddRangeAsync([vesselOperator, randomVesselOperator1, randomVesselOperator2]);
        
        List<Vessel> vessels =
        [
            new VesselProvider().WithOperator(vesselOperator).Provide(),
            new VesselProvider().WithOperator(randomVesselOperator1).Provide(),
            new VesselProvider().WithOperator(randomVesselOperator2).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Assert
        var results = await _vesselService.GetByFilterAsync(null, null, operatorName, filterOperator);
        
        // Act
        const int expectedVesselCount = 1;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Operator.Name.Should().Be(operatorName);
        }
    }

    [Test]
    public async Task
        GetByFiltersAsync_FilterByOperatorNameWithContainsOperator_ShouldReturnVesselsThatContainOperatorName()
    {
        // Arrange
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string filterQuery = "GORUM";
        const string operatorName1 = "Gorum co.";
        const string operatorName2 = "gorum";
        const string operatorName3 = "Egorums co";
        var vesselOperator1 = new CompanyProvider().WithName(operatorName1).Provide();
        var vesselOperator2 = new CompanyProvider().WithName(operatorName2).Provide();
        var vesselOperator3 = new CompanyProvider().WithName(operatorName3).Provide();

        await _dbContext.Companies.AddRangeAsync([vesselOperator1, vesselOperator2, vesselOperator3]);
        
        List<Vessel> vessels =
        [
            new VesselProvider().WithOperator(vesselOperator1).Provide(),
            new VesselProvider().WithOperator(vesselOperator2).Provide(),
            new VesselProvider().WithOperator(vesselOperator3).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Assert
        var results = await _vesselService.GetByFilterAsync(null, null, filterQuery, filterOperator);
        
        // Act
        const int expectedVesselCount = 3;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Operator.Name.Should().Be(operatorName1);
            results.Last().Operator.Name.Should().Be(operatorName3);
        }
    }
    
    [Test]
    public async Task GetByFilterAsync_FilterByImoNumberAndNameWithContainsOperator_ShouldReturnVesselsThatContainImoNumberAndName()
    {
        const FilterOperator filterOperator = FilterOperator.Contains;
        const string imoFilterQuery = "34";
        const string correctImo1 = "IMO 1234567";
        const string correctImo2 = "IMO 9883417";
        const string randomImo = "IMO 7303059";

        const string nameFilterQuery = "docker";
        const string name1 = "blueDocker";
        const string name2 = "Dockers of gas";
        const string randomName = "Rocker of Gas";
        List<Vessel> vessels =
        [
            new VesselProvider().WithName(name1).WithImo(correctImo1).Provide(),
            new VesselProvider().WithName(name2).WithImo(correctImo2).Provide(),
            new VesselProvider().WithName(randomName).WithImo(randomImo).Provide(),
        ];

        await _dbContext.Vessels.AddRangeAsync(vessels);
        await _dbContext.SaveChangesAsync();
        
        // Act
        var results = await _vesselService.GetByFilterAsync(imoFilterQuery, nameFilterQuery, null, filterOperator);
        
        // Assert
        const int expectedVesselCount = 2;
        using (new AssertionScope())
        {
            results.Should().NotBeNull();
            results.Should().HaveCount(expectedVesselCount);
            results.First().Imo.Should().Be(correctImo1);
            results.Last().Imo.Should().Be(correctImo2);
            results.First().Name.Should().Be(name1);
            results.Last().Name.Should().Be(name2);
        }
    }
}