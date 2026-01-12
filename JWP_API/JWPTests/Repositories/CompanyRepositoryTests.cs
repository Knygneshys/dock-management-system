using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class CompanyRepositoryTests
{
    private ICompanyRepository _companyRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _companyRepository = new CompanyRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }
    
    [Test]
    public async Task CreateAsync_CompanyIsValid_ShouldReturnCompanyCode()
    {
        // Arrange
        var company = new CompanyProvider().Provide();

        // Act
        var result = await _companyRepository.CreateAsync(company);

        // Assert
        var resultCompany = await _dbContext.Companies.FirstOrDefaultAsync(c => c.Code.Equals(result));
        using (new AssertionScope())
        {
            result.Should().Be(company.Code);
            resultCompany.Should().Be(company);
        }
    }

    [Test]
    public async Task ExistsAsync_EntityExistsInDatabase_ShouldReturnTrue()
    {
        // Arrange
        var code = "COMP555";
        var company = new CompanyProvider().WithCode(code).Provide();
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.SaveChangesAsync();
        // Act
        var result = await _companyRepository.ExistsAsync(code);

        // Assert
        var resultExist = await _dbContext.Companies.AnyAsync(c => c.Code.Equals(code));
        using (new AssertionScope())
        {
            result.Should().BeTrue();
            resultExist.Should().BeTrue();
        }
    }
    
    [Test]
    public async Task ExistsAsync_EntityDoesNotExistInDatabase_ShouldReturnFalse()
    {
        // Arrange
        var code = "COMP444";
        var company = new CompanyProvider().Provide();
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.SaveChangesAsync();
        // Act
        var result = await _companyRepository.ExistsAsync(code);

        // Assert
        var resultExist = await _dbContext.Companies.AnyAsync(c => c.Code.Equals(code));
        using (new AssertionScope())
        {
            result.Should().BeFalse();
            resultExist.Should().BeFalse();
        }
    }

    [Test]
    public async Task GetAllAsync_CompaniesExistInDatabase_ShouldReturnAllCompanies()
    {
        // Arrange
        var companies = new CompanyProvider().ProvideList();
        await _dbContext.Companies.AddRangeAsync(companies);
        await _dbContext.SaveChangesAsync();
        // Act
        var result = await _companyRepository.GetAllAsync();

        // Assert
        using (new AssertionScope())
        {
            result.Should().HaveCount(3);
            result.Should().BeEquivalentTo(companies);
        }
    }
}