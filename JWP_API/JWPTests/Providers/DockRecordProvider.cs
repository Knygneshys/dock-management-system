using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.DTOs.VesselTypeDTOs;

namespace JWPTests.Providers;

public class DockRecordProvider
{
    private Guid _id { get; set; } = Guid.NewGuid();
    private string _code { get; set; } = $"DCK-{Guid.NewGuid().ToString()[..8]}";

    private string _name { get; set; } = "Main Dock";
    private string _location { get; set; } = "Wilhelmshaven North";
    private float _length { get; set; } = 450;
    private float _depth { get; set; } = 18;
    private float _maxDraft { get; set; } = 16;

    private ICollection<VesselType> _allowedVesselTypes { get; set; } = new List<VesselType>();

    // Fluent setup methods
    public DockRecordProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public DockRecordProvider WithCode(string code)
    {
        _code = code;
        return this;
    }

    public DockRecordProvider WithName(string name)
    {
        _name = name;
        return this;
    }

    public DockRecordProvider WithLocation(string location)
    {
        _location = location;
        return this;
    }

    public DockRecordProvider WithLength(float length)
    {
        _length = length;
        return this;
    }

    public DockRecordProvider WithDepth(float depth)
    {
        _depth = depth;
        return this;
    }

    public DockRecordProvider WithMaxDraft(float maxDraft)
    {
        _maxDraft = maxDraft;
        return this;
    }

    public DockRecordProvider WithAllowedVesselTypes(ICollection<VesselType> vesselTypes)
    {
        _allowedVesselTypes = vesselTypes;
        return this;
    }

    // ---- Provider methods ----

    public DockRecord Provide()
    {
        var ret = new DockRecord()
        {
            Id = _id,
            Code = _code,
            Name = _name,
            Location = _location,
            Length = _length,
            Depth = _depth,
            MaxDraft = _maxDraft
        };
        ret.AllowedVesselTypes.AddRange(_allowedVesselTypes);
        return ret;
    }

    public DockRecordCreationDto ProvideDto()
    {
        return new DockRecordCreationDto
        {
            Name = _name,
            Location = _location,
            Length = _length,
            Depth = _depth,
            MaxDraft = _maxDraft
        };
    }

    public List<DockRecord> ProvideList()
    {
        return new List<DockRecord>
        {
            new DockRecordProvider().WithId(Guid.NewGuid()).WithCode("DCK-001").WithName("Main Dock").Provide(),
            new DockRecordProvider().WithId(Guid.NewGuid()).WithCode("DCK-002").WithName("East Dock").Provide(),
            new DockRecordProvider().WithId(Guid.NewGuid()).WithCode("DCK-003").WithName("West Dock").Provide()
        };
    }
}