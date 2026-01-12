using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class PrivacyPolicyMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<PrivacyPolicy, PrivacyPolicyResponseDto>();
    }
}