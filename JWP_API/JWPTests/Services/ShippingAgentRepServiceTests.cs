using FluentAssertions;
using JadeWesserPort.Data;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.System;
using JadeWesserPort.Mappers;
using JadeWesserPort.Services;
using JWPTests.Providers;
using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;

namespace JWPTests.Services;

[TestFixture]
public class ShippingAgentRepServiceTests
{
    private JWPDbContext _dbContext;
    private ShippingAgentRepService _service;
    private ShippingAgentRepresentativeRepository _sarRepo;
    private VVNRepository _vvnRepo;
    private CompanyRepository _companyRepo;
    private UserRepository _userRepo;
    private IMapper _mapper;

    [SetUp]
    public void SetUp()
    {
        _dbContext = JwpInMemoryDbContext.GetContext();
        _sarRepo = new ShippingAgentRepresentativeRepository(_dbContext);
        _companyRepo = new CompanyRepository(_dbContext);
        _userRepo = new UserRepository(_dbContext);
        var config = new TypeAdapterConfig();
        config.Apply(new VVNMapper());
        config.Apply(new SARMapper());
        _mapper = new Mapper(config);
        _vvnRepo = new VVNRepository(_dbContext);
        _service = new ShippingAgentRepService(_sarRepo, _companyRepo, _userRepo, _mapper);
    }

    [TearDown]
    public async Task TearDown() => await _dbContext.DisposeAsync();

    [Test]
    public async Task CreateAsync_ValidDto_ShouldPersistRepresentativeAndUser()
    {
        var company = new Company { Id = Guid.NewGuid(), Code = "COMP001", Name = "Blue Ocean" };
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.SaveChangesAsync();

        var dto = new ShippingAgentRepresentativeProvider().WithCompany(company).ProvideDto();

        var resultEmail = await _service.CreateAsync(dto);

        var rep = await _dbContext.ShippingAgentRepresentatives.Include(r => r.User).FirstOrDefaultAsync();
        resultEmail.Should().Be(dto.Email);
        rep.Should().NotBeNull();
        rep!.User.Email.Should().Be(dto.Email);
    }

    [Test]
    public async Task CreateAsync_EmailAlreadyExists_ShouldThrowInvalidOperationException()
    {
        var company = new Company { Id = Guid.NewGuid(), Code = "COMP002", Name = "Red Sea" };
        var user = new User { Id = Guid.NewGuid(), Email = "dup@mail.com" };
        await _dbContext.Companies.AddAsync(company);
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();

        var dto = new ShippingAgentRepresentativeProvider().WithEmail("dup@mail.com").WithCompany(company).ProvideDto();

        var act = async () => await _service.CreateAsync(dto);
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("Email already in use by another user.");
    }

    [Test]
    public async Task GetAllAsync_WhenDataExists_ShouldReturnList()
    {
        var reps = new List<ShippingAgentRepresentative>
        {
            new ShippingAgentRepresentativeProvider().Provide(),
            new ShippingAgentRepresentativeProvider().WithEmail("other@mail.com").Provide()
        };
        await _dbContext.ShippingAgentRepresentatives.AddRangeAsync(reps);
        await _dbContext.SaveChangesAsync();

        var result = await _service.GetAllAsync();

        result.Should().HaveCount(2);
    }

    [Test]
    public async Task GetSARVVNsAsync_WhenDataExists_ShouldReturnDTOList()
    {
        //Arrange
        var repEmail = "e@e.com";
        var rep = new ShippingAgentRepresentativeProvider().WithEmail(repEmail).Provide();
        await _sarRepo.CreateAsync(rep);
        var eta = new DateTime(2026, 10, 10, 12, 30, 0);
        var etd = new DateTime(2026, 10, 11, 13, 30, 0);
        var vvn = new VesselVisitNotificationProvider().WithSAR(rep).WithEta(eta).WithEtd(etd).Provide();
        await _vvnRepo.CreateAsync(vvn);

        //Act
        var resDto = await _service.GetSARVVNsAsync(repEmail);

        //Assert
        resDto.Should().NotBeNull();
        resDto.Should().HaveCount(1);
        resDto[0].Eta.Should().Be(eta);
        resDto[0].Etd.Should().Be(etd);
        resDto[0].ShippingAgentRepresentative.Email.Should().Be(repEmail);
    }
}
