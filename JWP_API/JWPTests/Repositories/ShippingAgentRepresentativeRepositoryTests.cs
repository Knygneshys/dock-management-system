using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;

[TestFixture]
public class ShippingAgentRepresentativeRepositoryTests
{
    private ShippingAgentRepresentativeRepository _repository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repository = new ShippingAgentRepresentativeRepository(_dbContext);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_GivenValidRepresentative_ShouldPersistAndReturnEmail()
    {
        var rep = new ShippingAgentRepresentativeProvider().Provide();

        var result = await _repository.CreateAsync(rep);

        var dbRep = await _dbContext.ShippingAgentRepresentatives.FirstOrDefaultAsync(r => r.User.Email.Equals(rep.User.Email));
        using (new AssertionScope())
        {
            result.Should().Be(rep.User.Email);
            dbRep.Should().NotBeNull();
            dbRep!.User.Email.Should().Be(rep.User.Email);
        }
    }

    [Test]
    public async Task ExistsByEmailAsync_WhenRepresentativeExists_ShouldReturnTrue()
    {
        var rep = new ShippingAgentRepresentativeProvider().Provide();
        await _dbContext.ShippingAgentRepresentatives.AddAsync(rep);
        await _dbContext.SaveChangesAsync();

        var exists = await _repository.ExistsByEmailAsync(rep.User.Email);

        exists.Should().BeTrue();
    }

    [Test]
    public async Task GetAllAsync_WhenDataExists_ShouldReturnAllRepresentatives()
    {
        // Arrange
        var repProvider = new ShippingAgentRepresentativeProvider();
        var reps = new List<ShippingAgentRepresentative>
        {
            repProvider.WithEmail("rep1@mail.com").Provide(),
            repProvider.WithEmail("rep2@mail.com").Provide()
        };

        await _dbContext.ShippingAgentRepresentatives.AddRangeAsync(reps);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _repository.GetAllAsync();

        // Assert
        result.Should().BeEquivalentTo(reps, options => options.ExcludingMissingMembers());
    }


    [Test]
    public async Task GetByEmailAsync_WhenExists_ShouldReturnRepresentativeWithCompanyAndUser()
    {
        var rep = new ShippingAgentRepresentativeProvider().Provide();
        await _dbContext.ShippingAgentRepresentatives.AddAsync(rep);
        await _dbContext.SaveChangesAsync();

        var result = await _repository.GetByEmailAsync(rep.User.Email);

        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result!.Company.Should().NotBeNull();
            result.User.Should().NotBeNull();
        }
    }
}
