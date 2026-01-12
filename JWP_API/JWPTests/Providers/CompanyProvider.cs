using JadeWesserPort.Domain.Entities;

namespace JWPTests.Providers;

public class CompanyProvider
{
    private static int _counter = 1;

    public Guid _id { get; set; } = Guid.NewGuid();
    public string _code { get; set; } = Guid.NewGuid().ToString("N")[..10];

    public string _name { get; set; } = "Company name co.";

    public virtual ICollection<Vessel>? _ownedVessels { get; set; } = new List<Vessel>();

    public virtual ICollection<Vessel>? _operatedVessels { get; set; } = new List<Vessel>();

    public CompanyProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }
    public CompanyProvider WithCode(string code)
    {
        _code = code;
        return this;
    }

    public CompanyProvider WithName(string name)
    {
        _name = name;
        return this;
    }
    
    public Company Provide()
    {
        _counter++;
        return new Company()
        {
            Id = _id,
            Code = _code,
            Name = _name,
            OwnedVessels = _ownedVessels,
            OperatedVessels = _operatedVessels,
        };
    }

    public List<Company> ProvideList()
    {
        _counter+=3;
        return
        [
            WithId(Guid.NewGuid()).WithCode("COMP001").Provide(),
            WithId(Guid.NewGuid()).WithCode("COMP002").Provide(),
            WithId(Guid.NewGuid()).WithCode("COMP003").Provide(),
        ];
    }
}