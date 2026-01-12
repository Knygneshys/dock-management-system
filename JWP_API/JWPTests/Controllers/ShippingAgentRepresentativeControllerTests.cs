using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Controllers;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.Services;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Helpers;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace JWPTests.Controllers;

[TestFixture]
public class ShippingAgentRepresentativeControllerTests
{
    private ShippingAgentRepresentativesController _controller;
    private ShippingAgentRepresentativeRepository _repRepo;
    private CompanyRepository _companyRepo;
    private UserRepository _userRepo;
    private ShippingAgentRepService _service;
    private IMapper _mapper;
    private JWPDbContext _dbContext;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _repRepo = new ShippingAgentRepresentativeRepository(_dbContext);
        _companyRepo = new CompanyRepository(_dbContext);
        _userRepo = new UserRepository(_dbContext);
        _mapper = new Mapper();
        _service = new ShippingAgentRepService(_repRepo, _companyRepo, _userRepo, _mapper);

        var mockAuthService = new Mock<IAuthService>();
        mockAuthService.Setup(
            x => x.UserIsAuthorizedByAuth0IdAsync(
                It.IsAny<string>(),
                It.IsAny<UserRole>()))
            .ReturnsAsync(true);

        var logger = NullLogger<ShippingAgentRepresentativesController>.Instance;

        _controller = new ShippingAgentRepresentativesController(_mapper, _service, mockAuthService.Object, logger)
        { ControllerContext = AuthHelper.CreateControllerContextWithUser() };
    }

    [TearDown]
    public async Task TearDown() => await _dbContext.DisposeAsync();

    [Test]
    public async Task CreateAsync_ValidDto_ShouldReturnOkWithEmail()
    {
        var company = new Company { Id = Guid.NewGuid(), Code = "COMP100", Name = "Ocean Freight" };
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.SaveChangesAsync();

        var dto = new ShippingAgentRepresentativeProvider().WithCompany(company).ProvideDto();

        var result = await _controller.CreateAsync(dto);

        using (new AssertionScope())
        {
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            okResult.Value.Should().Be(dto.Email);
        }
    }

    [Test]
    public async Task CreateAsync_DuplicateEmail_ShouldReturnBadRequest()
    {
        var company = new Company { Id = Guid.NewGuid(), Code = "COMP200", Name = "Global Lines" };
        var existingUser = new User { Id = Guid.NewGuid(), Email = "dup@agent.com" };
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.Users.AddAsync(existingUser);
        await _dbContext.SaveChangesAsync();

        var dto = new ShippingAgentRepresentativeProvider().WithCompany(company).WithEmail("dup@agent.com").WithUser(existingUser).ProvideDto();

        var result = await _controller.CreateAsync(dto);

        var badRequest = result.Result.Should().BeOfType<BadRequestObjectResult>().Subject;
        badRequest.Value.Should().Be("Email already in use by another user.");
    }

    [Test]
    public async Task GetAllAsync_WhenDataExists_ShouldReturnOkWithList()
    {
        var reps = new List<ShippingAgentRepresentative>
        {
            new ShippingAgentRepresentativeProvider().Provide(),
            new ShippingAgentRepresentativeProvider().WithEmail("another@mail.com").Provide()
        };
        await _dbContext.ShippingAgentRepresentatives.AddRangeAsync(reps);
        await _dbContext.SaveChangesAsync();

        var result = await _controller.GetAllAsync();

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var list = okResult.Value.Should().BeAssignableTo<IEnumerable<object>>().Subject;
        list.Should().HaveCount(2);
    }
}
