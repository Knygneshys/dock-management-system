using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;

namespace JWPTests.Providers;

public class VesselProvider
{
    private Guid _id { get; set; } = Guid.NewGuid();

    private string _imo { get; set; } = "IMO 1008360";

    private string _name { get; set; } = "Test Vessel";

    private Guid _ownerId { get; set; } = Guid.NewGuid();

    private Guid _operatorId { get; set; } = Guid.NewGuid();

    private Guid _vesselTypeId { get; set; } = Guid.NewGuid();

    private VesselType? _type { get; set; }

    private Company? _owner { get; set; }

    private Company? _operator { get; set; } 

    public VesselProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public VesselProvider WithImo(string imo)
    {
        _imo = imo;
        return this;
    }

    public VesselProvider WithName(string name)
    {
        _name = name;
        return this;
    }
    
    public VesselProvider WithType(VesselType type)
    {
        _type = type;
        _vesselTypeId = type.Id;
        return this;
    }
    
    public VesselProvider WithOwner(Company owner)
    {
        _owner = owner;
        _ownerId = owner.Id;
        return this;
    }

    public VesselProvider WithOperator(Company operatorCompany)
    {
        _operator = operatorCompany;
        _operatorId = operatorCompany.Id;
        return this;
    }
    
    public Vessel Provide()
    {
        return new Vessel()
        {
            Id = _id,
            Imo = _imo,
            Name = _name,
            OwnerId = _ownerId,
            OperatorId = _operatorId,
            TypeId = _vesselTypeId,
            Type = _type ?? new VesselTypeProvider().WithId(_vesselTypeId).Provide(),
            Owner = _owner ?? new CompanyProvider().WithId(_ownerId).Provide(),
            Operator = _operator ?? new CompanyProvider().WithId(_operatorId).Provide()
        };
    }

    public List<Vessel> ProvideList()
    {
        var companies = new CompanyProvider().ProvideList();
        var vesselTypes = new VesselTypeProvider().ProvideList();
        return
        [
            WithId(Guid.NewGuid())
                .WithImo("IMO 1008350")
                .Provide(),
            WithId(Guid.NewGuid())
                .WithImo("IMO 1008351")
                .WithOperator(companies[0])
                .WithOwner(companies[0])
                .WithType(vesselTypes[0])
                .Provide(),
            WithId(Guid.NewGuid())
                .WithImo("IMO 1008352")
                .WithOperator(companies[1])
                .WithOwner(companies[1])
                .WithType(vesselTypes[1])
                .Provide()
        ];
    }
}