using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;
public class QualificationMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<QualificationDTO, Qualification>();

        config.NewConfig<Qualification, QualificationDTO>();
    }
}
