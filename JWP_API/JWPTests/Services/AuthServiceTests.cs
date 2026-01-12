using FluentAssertions;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.System;
using JadeWesserPort.Services;
using JWPTests.Providers;
using Microsoft.AspNetCore.Mvc;

namespace JWPTests.Services;

[TestFixture]
public class AuthServiceTests
{
    private IUserRepository _userRepository;
    private JWPDbContext _dbContext;
    private AuthService _authService;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _userRepository = new UserRepository(_dbContext);
        _authService = new AuthService(_userRepository);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.DisposeAsync();
    }

    // MethodName_StateUnderTest_ExpectedBehavior

    [Test]
    public async Task UserIsAuthorizedByAuth0IdAsync_UserIsAuthorized_ReturnTrue()
    {
        //Arrange
        var user = new UserProvider()
            .WithRole(UserRole.PortAuthorityOfficer)
            .Provide();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        //Act
        var result = await _authService.UserIsAuthorizedByAuth0IdAsync(user.Auth0Id, UserRole.PortAuthorityOfficer);

        //Assert
        result.Should().Be(true);
    }

    [Test]
    public async Task UserIsAuthorizedByAuth0IdAsync_UserIsUnauthorized_ReturnFalse()
    {
        //Arrange
        var user = new UserProvider()
            .WithRole(UserRole.PortAuthorityOfficer)
            .Provide();

        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        //Act
        var result = await _authService.UserIsAuthorizedByAuth0IdAsync(user.Auth0Id, UserRole.LogisticsOperator);

        //Assert
        result.Should().Be(false);
    }
}

