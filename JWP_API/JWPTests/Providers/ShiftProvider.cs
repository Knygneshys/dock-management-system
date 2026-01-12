using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;

namespace JWPTests.Providers;

public class ShiftProvider
{
    private Guid _id = Guid.NewGuid();
    private DateTime _from = DateTime.Now;
    private DateTime _to = DateTime.Now.AddHours(8);
    private Guid _staffMemberId = Guid.NewGuid();
    private StaffMember _staffMember = null!;
    private Guid _resourceId = Guid.NewGuid();
    private Resource _resource = null!;

    public Shift Provide()
    {
        return new Shift
        {
            Id = _id,
            From = _from,
            To = _to,
            StaffMemberId = _staffMemberId,
            StaffMember = _staffMember,
            ResourceId = _resourceId,
            Resource = _resource
        };
    }

    public ShiftProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public ShiftProvider WithFrom(DateTime from)
    {
        _from = from;
        return this;
    }

    public ShiftProvider WithTo(DateTime to)
    {
        _to = to;
        return this;
    }

    public ShiftProvider WithStaffMemberId(Guid staffMemberId)
    {
        _staffMemberId = staffMemberId;
        return this;
    }

    public ShiftProvider WithStaffMember(StaffMember staffMember)
    {
        _staffMember = staffMember;
        _staffMemberId = staffMember.Id;
        return this;
    }

    public ShiftProvider WithResourceId(Guid resourceId)
    {
        _resourceId = resourceId;
        return this;
    }

    public ShiftProvider WithResource(Resource resource)
    {
        _resource = resource;
        _resourceId = resource.Id;
        return this;
    }
}
