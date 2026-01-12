using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CrewMembeDTOs;

namespace JWPTests.Providers;

internal class CrewMemberProvider
{
    public int _citizenshipId { get; set; } = 1;
    public string _fullName { get; set; } = "Mr Crew Membrer";
    public string _nationality { get; set; } = "Portuguese";

    public CrewMemberProvider WithCitizenShipId(int citizenshipId)
    {
        _citizenshipId = citizenshipId;
        return this;
    }

    public CrewMemberProvider WithName(string name)
    {
        _fullName = name;
        return this;
    }
    public CrewMemberProvider WithNationality(string nationality)
    {
        _nationality = nationality;
        return this;
    }

    public CrewMember Provide()
    {
        return new CrewMember()
        {
            CitizenshipId = _citizenshipId,
            FullName = _fullName,
            Nationality = _nationality
        };
    }

    public CrewMemberDTO ProvideDto()
    {
        return new CrewMemberDTO()
        {
            CitizenshipId = _citizenshipId,
            FullName = _fullName,
            Nationality = _nationality
        };
    }
}
