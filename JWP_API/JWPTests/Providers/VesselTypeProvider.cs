using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselTypeDTOs;

namespace JWPTests.Providers;

public class VesselTypeProvider
{
    private Guid _id { get; set; } = Guid.NewGuid();

    private string _code { get; set; } = "LCS";
    private string _name { get; set; } = "Name";

    private string _description { get; set; } = "Long description";

    private int _capacity { get; set; } = 1039;

    private int _maxRows { get; set; } = 100;

    private int _maxBays { get; set; } = 40;

    private int _maxTiers { get; set; } = 50;
    
    private ICollection<DockRecord> _docks { get; set; } = new List<DockRecord>();

    public VesselTypeProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public VesselTypeProvider WithCode(string code)
    {
        _code = code;
        return this;
    }

    public VesselTypeProvider WithName(string name)
    {
        _name = name;
        return this;
    }

    public VesselTypeProvider WithDescription(string description)
    {
        _description = description;
        return this;
    }
    
    public VesselType Provide()
    {
        return new VesselType()
        {
            Id = _id,
            Code = _code,
            Name = _name,
            Description = _description,
            Capacity = _capacity,
            MaxRows = _maxRows,
            MaxBays = _maxBays,
            MaxTiers = _maxTiers,
            Docks = _docks,
        };
    }

    public VesselTypeDto ProvideDto()
    {
        return new VesselTypeDto()
        {
            Code = _code,
            Name = _name,
            Description = _description,
            Capacity = _capacity,
            MaxRows = _maxRows,
            MaxBays = _maxBays,
            MaxTiers = _maxTiers,
        };
    }
    
    public VesselTypeUpdateDto ProvideUpdateDto()
    {
        return new VesselTypeUpdateDto()
        {
            Name = _name,
            Description = _description,
            Capacity = _capacity,
            MaxRows = _maxRows,
            MaxBays = _maxBays,
            MaxTiers = _maxTiers,
        };
    }
    
    public List<VesselType> ProvideList()
    {
        return
        [
            WithId(Guid.NewGuid()).WithCode("SVT").Provide(),
            WithId(Guid.NewGuid()).WithCode("DSV").Provide(),
            WithId(Guid.NewGuid()).WithCode("VLV").Provide(),
        ];
    }
}