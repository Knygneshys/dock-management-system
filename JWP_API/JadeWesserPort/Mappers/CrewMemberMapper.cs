using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CrewMembeDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class CrewMemberMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CrewMemberDTO, CrewMember>();
        config.NewConfig<CrewMember, CrewMemberDTO>();
    }
}
