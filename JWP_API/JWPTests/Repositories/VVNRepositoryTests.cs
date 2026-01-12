using FluentAssertions;
using FluentAssertions.Execution;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JWPTests.Providers;

namespace JWPTests.Repositories;

[TestFixture]
public class VVNRepositoryTests
{
    private TestContext _context;

    [SetUp]
    public void SetUp()
    {
        _context = new TestContext(true);
    }

    [TearDown]
    public async Task TearDown()
    {
        await _context.DisposeAsync();
    }

    [Test]
    public async Task CreateAsync_CorrectDataGiven_ShouldReturnCreatedCode()
    {
        // Arrange
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(1010)
            .WithStatus(VVNStatus.InProgress)
            .Provide();

        // Act
        var resultCode = await _context.VVNRepository.CreateAsync(vvn);

        // Assert
        var createdVVN = await _context.VVNRepository.GetByCodeAsync(vvn.Code);

        using (new AssertionScope())
        {
            resultCode.Should().Be(vvn.Code);
            createdVVN.Should().NotBeNull();
            createdVVN.Status.Should().Be(VVNStatus.InProgress);
            createdVVN.Code.Should().Be(vvn.Code);
        }
    }

    [Test]
    public async Task GetAllAsync_WhenCalled_ShouldReturnAllVVNs()
    {
        // Arrange
        var sar = new ShippingAgentRepresentativeProvider().Provide();
        var vessel = new VesselProvider().Provide();
        var vvn1 = new VesselVisitNotificationProvider().WithCode(1).Provide();
        var vvn2 = new VesselVisitNotificationProvider().WithCode(2).Provide();
        var vvn3 = new VesselVisitNotificationProvider().WithCode(3).Provide();
        vvn1.Vessel = vessel;
        vvn2.Vessel = vessel;
        vvn3.Vessel = vessel;
        vvn1.ShippingAgentRepresentative = sar;
        vvn2.ShippingAgentRepresentative = sar;
        vvn3.ShippingAgentRepresentative = sar;
        var vvns = new List<VesselVisitNotification>()
        {
            vvn1,vvn2,vvn3
        };

        await _context.VVNRepository.CreateAsync(vvn1);
        await _context.VVNRepository.CreateAsync(vvn2);
        await _context.VVNRepository.CreateAsync(vvn3);

        // Act
        var results = await _context.VVNRepository.GetAllAsync();

        // Assert
        results.Should().BeEquivalentTo(vvns);
    }

    [Test]
    public async Task GetByCodeAsync_ExistingCode_ShouldReturnCorrectVVN()
    {
        // Arrange
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(1020)
            .WithStatus(VVNStatus.Submitted)
            .Provide();
        var sar = new ShippingAgentRepresentativeProvider().Provide();
        var vessel = new VesselProvider().Provide();

        vvn.Vessel = vessel;
        vvn.ShippingAgentRepresentative = sar;

        await _context.VVNRepository.CreateAsync(vvn);

        // Act
        var result = await _context.VVNRepository.GetByCodeAsync(vvn.Code);

        // Assert
        using (new AssertionScope())
        {
            result.Should().NotBeNull();
            result.Code.Should().Be(vvn.Code);
            result.Status.Should().Be(VVNStatus.Submitted);
        }
    }

    [Test]
    public async Task FindCrewMemberByCIDAsync_UserIsThere_ShouldReturnCrewMember()
    {
        //Arrange
        var vvnCode = 300;
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(vvnCode)
            .Provide();
        await _context.VVNRepository.CreateAsync(vvn);
        var cmId = 123;
        var cmName = "Test Name";
        var cm = new CrewMemberProvider().WithCitizenShipId(cmId).WithName(cmName).Provide();
        vvn.CrewManifest.Add(cm);
        await _context.VVNRepository.SaveChangesAsync();

        //Act
        var res = await _context.VVNRepository.FindCrewMemberByCIDAsync(cmId);

        //Assert
        res.Should().NotBeNull();
        res.CitizenshipId.Should().Be(cmId);
        res.FullName.Should().Be(cmName);
    }

    [Test]
    public async Task FindCrewMemberByCIDAsync_UserIsNotThere_ShouldReturnNull()
    {
        //Arrange
        var vvnCode = 300;
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(vvnCode)
            .Provide();
        await _context.VVNRepository.CreateAsync(vvn);
        var cmId = 123;
        var cmName = "Test Name";
        var cm = new CrewMemberProvider().WithCitizenShipId(cmId).WithName(cmName).Provide();
        vvn.CrewManifest.Add(cm);
        await _context.VVNRepository.SaveChangesAsync();

        //Act
        var res = await _context.VVNRepository.FindCrewMemberByCIDAsync(1234);

        //Assert
        res.Should().BeNull();
    }
}