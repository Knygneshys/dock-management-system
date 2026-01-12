using FluentAssertions;
using JadeWesserPort.Data;
using JadeWesserPort.Seeders;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Seeders;

[TestFixture]
public class UserSeederTests
{
    private UserSeeder _seeder;
    private JWPDbContext _dbContext;
    
    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _seeder = new UserSeeder(_dbContext);
    }

    [TearDown]
    public async Task Teardown()
    {
        await _dbContext.DisposeAsync();
    }
    
    [Test]
    public async Task SeedAsync_DatabaseHasUsers_ShouldNotSeed()
    {
        // Arrange
        var users = new UserProvider().ProvideList();
        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.SaveChangesAsync();
        
        // Act
        await _seeder.SeedAsync();
        
        // Assert
        var actualUsers = await _dbContext.Users.ToListAsync();
        actualUsers.Should().BeEquivalentTo(users);
    }
}