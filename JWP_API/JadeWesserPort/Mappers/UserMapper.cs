using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class UserMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<UserDTO, User>();
    }
}       

