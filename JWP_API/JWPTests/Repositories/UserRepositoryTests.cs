using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JWPTests.Providers;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Repositories;
[TestFixture]
public class UserRepositoryTests
{
    private IUserRepository _userRepository;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _userRepository = new UserRepository(_dbContext);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_CorrectDataGiven_ReturnCreatedUserId()
    {
        //Arrange
        var auth0Id = "testId";
        var user = new UserProvider()
            .WithAuth0Id(auth0Id)
            .Provide();

        //Act
        var resultId = await _userRepository.CreateAsync(user);

        //Assert
        var resultUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Auth0Id.Equals(auth0Id));
        using (new AssertionScope())
        {
            resultId.Should().Be(user.Id);
            resultUser.Should().BeEquivalentTo(user);
        }
    }

    [Test]
    public async Task FindByIdAsync_CorrectDataGiven_ShouldReturnUserById()
    {
        // Arrange
        var auth0Id = "testId";
        var user = new UserProvider()
            .WithAuth0Id(auth0Id)
            .Provide();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _userRepository.GetByAuth0IdAsync(auth0Id);

        // Assert
        result.Should().BeEquivalentTo(user);
    }

    [Test]
    public async Task GetByIdAsync_NonExistentIdGiven_ShouldReturnNull()
    {
        // Arrange
        var auth0Id = "testId";
        var user = new UserProvider().Provide();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        // Act
        var result = await _userRepository.GetByAuth0IdAsync(auth0Id);

        // Assert
        result.Should().BeNull();
    }

    [Test]
    public async Task GetAllAsync_MethodCalled_ShouldReturnListOfUsers()
    {
        // Arrange
        var users = new UserProvider().ProvideList();

        await _dbContext.Users.AddRangeAsync(users);
        await _dbContext.SaveChangesAsync();

        // Act
        var results = await _userRepository.GetAllAsync();

        // Assert
        results.Should().BeEquivalentTo(users);
    }
}

