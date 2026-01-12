using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.DTOs.ResourceDTOs;
using Mapster;

namespace JadeWesserPort.Mappers
{
    public class ResourceMapper : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<ResourceCreateDTO, Resource>()
                .Ignore(dst => dst.Qualifications);

            config.NewConfig<ResourceDTO, Resource>();
            config.NewConfig<Resource, ResourceDTO>();
            config.NewConfig<STSCrane, ResourceDTO>();
        }
    }
}
