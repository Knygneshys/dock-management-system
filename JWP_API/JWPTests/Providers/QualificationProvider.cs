using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;

namespace JWPTests.Providers;

public class QualificationProvider
{
    private Guid _id { get; set; } = Guid.NewGuid();
    private string _name { get; set; } = "Pilot License";
    private string _code { get; set; } = "PL01";
    private DateTime _createdAt { get; set; } = DateTime.Now.AddDays(-10);
    private DateTime? _updatedAt { get; set; } = null;

    public QualificationProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public QualificationProvider WithCode(string code)
    {
        _code = code;
        return this;
    }
    
    public QualificationProvider WithName(string name)
    {
        _name = name;
        return this;
    }

    public Qualification Provide()
    {
        return new Qualification
        {
            Id = _id,
            Name = _name,
            Code = _code,
            CreatedAt = _createdAt,
            UpdatedAt = _updatedAt
        };
    }

    public QualificationDTO ProvideDto()
    {
        return new QualificationDTO
        {
            Name = _name,
            Code = _code
        };
    }

    public List<Qualification> ProvideList()
    {
        return new List<Qualification>
        {
            WithId(Guid.NewGuid()).WithCode("PL01").Provide(),
            WithId(Guid.NewGuid()).WithCode("MC02").Provide(),
            WithId(Guid.NewGuid()).WithCode("AB03").Provide()
        };
    }
}