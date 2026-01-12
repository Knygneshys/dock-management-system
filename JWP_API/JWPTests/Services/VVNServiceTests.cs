using FluentAssertions;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CrewMembeDTOs;
using JadeWesserPort.DTOs.VVNFeedbackDTOs;
using JWPTests.Providers;

namespace JWPTests.Services;
internal class VVNServiceTests
{
    private TestContext _context;

    [SetUp]
    public void SetUp()
    {
        _context = new TestContext();
    }

    [TearDown]
    public async Task TearDown()
    {
        await _context.DisposeAsync();
    }

    [Test]
    public async Task AddCrewMembersAsync_CorrectList_ReturnEmptyList()
    {
        //Arrange
        var vvnCode = 300;
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(vvnCode)
            .Provide();
        var sar = new ShippingAgentRepresentativeProvider().Provide();
        var vessel = new VesselProvider().Provide();
        vvn.ShippingAgentRepresentative = sar;
        vvn.Vessel = vessel;
        await _context.VVNRepository.CreateAsync(vvn);

        var cm1Name = "Name1";
        var cm2Name = "Name2";
        var cm3Name = "Name3";
        var cm1 = new CrewMemberProvider().WithCitizenShipId(1).WithName(cm1Name).ProvideDto();
        var cm2 = new CrewMemberProvider().WithCitizenShipId(2).WithName(cm2Name).ProvideDto();
        var cm3 = new CrewMemberProvider().WithCitizenShipId(3).WithName(cm3Name).ProvideDto();
        var dtos = new List<CrewMemberDTO>
        {
            cm1,
            cm2,
            cm3
        };

        //Act
        var ret = await _context.VVNService.AddCrewMembersAsync(vvnCode, dtos);
        var cm1Ent = await _context.VVNRepository.FindCrewMemberByCIDAsync(1);
        var cm2Ent = await _context.VVNRepository.FindCrewMemberByCIDAsync(2);
        var cm3Ent = await _context.VVNRepository.FindCrewMemberByCIDAsync(3);

        //Assert
        ret.Should().BeNullOrEmpty();
        cm1Ent.Should().NotBeNull();
        cm2Ent.Should().NotBeNull();
        cm3Ent.Should().NotBeNull();
        cm1Ent.FullName.Should().Be(cm1Name);
        cm2Ent.FullName.Should().Be(cm2Name);
        cm3Ent.FullName.Should().Be(cm3Name);
    }

    [Test]
    public async Task AcceptVVNAsync_CorrectVVN_ReturnVVNDto()
    {
        //Arrange
        var vvnCode = 300;
        var vvn = new VesselVisitNotificationProvider()
            .WithCode(vvnCode)
            .Provide();
        var sar = new ShippingAgentRepresentativeProvider().Provide();
        var vessel = new VesselProvider().Provide();
        vvn.ShippingAgentRepresentative = sar;
        vvn.Vessel = vessel;
        await _context.VVNRepository.CreateAsync(vvn);

        List<VesselType> allowedTypes = [vessel.Type];
        var dock = new DockRecordProvider().WithAllowedVesselTypes(allowedTypes).Provide();
        await _context.DockRecordRepository.CreateAsync(dock);

        VVNFeedbackDTO feedack = new()
        {
            OfficerId = sar.User.Email,
            Reason = "reason"
        };

        //Act
        var ret = await _context.VVNService.AcceptVVNAsync(vvn, feedack, sar.User.Email);

        //Assert
        ret.Should().NotBeNull();
        ret.Code.Should().Be(vvnCode);
        ret.Status.Should().Be(VVNStatus.Approved);
    }

    [Test]
    public async Task AcceptVVNAsync_OccupiedDock_ThrowException()
    {
        //Arrange
        var vvn1 = new VesselVisitNotificationProvider()
            .WithCode(1)
            .Provide();
        var vvn2 = new VesselVisitNotificationProvider()
            .WithCode(2)
            .Provide();
        var sar = new ShippingAgentRepresentativeProvider().Provide();
        var vessel = new VesselProvider().Provide();
        vvn1.ShippingAgentRepresentative = sar;
        vvn2.ShippingAgentRepresentative = sar;
        vvn1.Vessel = vessel;
        vvn2.Vessel = vessel;
        await _context.VVNRepository.CreateAsync(vvn1);
        await _context.VVNRepository.CreateAsync(vvn2);

        List<VesselType> allowedTypes = [vessel.Type];
        var dock = new DockRecordProvider().WithAllowedVesselTypes(allowedTypes).Provide();
        await _context.DockRecordRepository.CreateAsync(dock);

        VVNFeedbackDTO feedack = new()
        {
            OfficerId = sar.User.Email,
            Reason = "reason"
        };
        await _context.VVNService.AcceptVVNAsync(vvn1, feedack, sar.User.Email);

        //Assert & Act
        Assert.ThrowsAsync<Exception>(async () => await _context.VVNService.AcceptVVNAsync(vvn2, feedack, sar.User.Email));
    }
}
