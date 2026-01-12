using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;

namespace JWPTests.Providers;

public class VesselVisitNotificationProvider
{
    private Guid _id = Guid.NewGuid();
    private int _code = 1000;
    private DateTime _eta = DateTime.UtcNow.AddDays(1);
    private DateTime _etd = DateTime.UtcNow.AddDays(3);
    private VVNStatus _status = VVNStatus.InProgress;
    private Vessel _vessel = new VesselProvider().Provide();
    private ShippingAgentRepresentative _sar = new ShippingAgentRepresentativeProvider().Provide();

    public VesselVisitNotificationProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public VesselVisitNotificationProvider WithNewId()
    {
        _id = Guid.NewGuid();
        return this;
    }

    public VesselVisitNotificationProvider WithCode(int code)
    {
        _code = code;
        return this;
    }

    public VesselVisitNotificationProvider WithEta(DateTime eta)
    {
        _eta = eta;
        return this;
    }

    public VesselVisitNotificationProvider WithEtd(DateTime etd)
    {
        _etd = etd;
        return this;
    }

    public VesselVisitNotificationProvider WithStatus(VVNStatus status)
    {
        _status = status;
        return this;
    }

    public VesselVisitNotificationProvider WithVessel(Vessel v)
    {
        _vessel = v;
        return this;
    }

    public VesselVisitNotificationProvider WithSAR(ShippingAgentRepresentative sar)
    {
        _sar = sar;
        return this;
    }

    public VesselVisitNotification Provide()
    {
        // jedes Provide bekommt eine frische Guid
        return new VesselVisitNotification
        {
            Id = _id == Guid.Empty ? Guid.NewGuid() : _id,
            Code = _code,
            Eta = _eta,
            Etd = _etd,
            Status = _status,
            Vessel = _vessel,
            ShippingAgentRepresentative = _sar
        };
    }

    public List<VesselVisitNotification> ProvideList()
    {
        return new List<VesselVisitNotification>
        {
            new VesselVisitNotificationProvider()
                .WithNewId()
                .WithCode(1001)
                .WithStatus(VVNStatus.InProgress)
                .Provide(),

            new VesselVisitNotificationProvider()
                .WithNewId()
                .WithCode(1002)
                .WithEta(DateTime.UtcNow.AddHours(5))
                .WithEtd(DateTime.UtcNow.AddHours(15))
                .WithStatus(VVNStatus.Submitted)
                .Provide(),

            new VesselVisitNotificationProvider()
                .WithNewId()
                .WithCode(1003)
                .WithEta(DateTime.UtcNow.AddDays(1))
                .WithEtd(DateTime.UtcNow.AddDays(2))
                .WithStatus(VVNStatus.Approved)
                .Provide()
        };
    }
}