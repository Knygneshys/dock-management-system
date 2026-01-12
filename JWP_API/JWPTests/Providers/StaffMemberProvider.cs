using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.StaffDTOs;

namespace JWPTests.Providers;

public class StaffMemberProvider
{
    private static int _mecanographicNumberCounter = 10000;
    
    private Guid _id { get; set; } = Guid.NewGuid();
    private int _mecanographicNumber { get; set; } = ++_mecanographicNumberCounter;
    private string _name { get; set; } = "John Doe";
    private string _email { get; set; } = "john.doe@example.com";
    private int _phone { get; set; } = 912345678;
    private StaffStatus _status { get; set; } = StaffStatus.Available;
    private List<string> _qualificationCodes { get; set; } = [];
    private bool _isActive { get; set; } = true;

    public StaffMemberProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public StaffMemberProvider WithStatus(StaffStatus status)
    {
        _status = status;
        return this;
    }

    public StaffMemberProvider WithMecanographicNumber(int mecanographicNumber)
    {
        _mecanographicNumber = mecanographicNumber;
        return this;
    }

    public StaffMemberProvider WithQualificationCode(string qualificationCode)
    {
        _qualificationCodes.Add(qualificationCode);
        return this;
    }

    public StaffMember Provide()
    {
        return new StaffMember
        {
            Id = _id,
            MecanographicNumber = _mecanographicNumber,
            Name = _name,
            Email = _email,
            Phone = _phone,
            Status = _status,
            isActive = true
        };
    }

    public StaffCreateDTO ProvideCreateDto()
    {
        return new StaffCreateDTO
        {
            MecanographicNumber = _mecanographicNumber,
            Name = _name,
            Email = _email,
            Phone = _phone,
            QualificationCodes = _qualificationCodes
        };
    }

    public StaffUpdateDTO ProvideUpdateDto()
    {
        return new StaffUpdateDTO
        {
            Name = _name,
            Email = _email,
            Phone = _phone,
            QualificationCodes = _qualificationCodes
        };
    }

    public List<StaffMember> ProvideList()
    {
        return new List<StaffMember>
        {
            new StaffMemberProvider().Provide(),
            new StaffMemberProvider().Provide(),
            new StaffMemberProvider().Provide()
        };
    }
}