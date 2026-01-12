using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VVNFeedbackDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class FeedbackMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<VVNFeedbackDTO, VVNFeedback>()
            .IgnoreNullValues(true);
        config.NewConfig<VVNFeedback, VVNFeedbackDTO>();

    }
}
