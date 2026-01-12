using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.OperationalWindowDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class OperationalWindowMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<OperationalWindowFormDTO, OperationalWindow>()
            .Map(dest => dest.DayOfWeek, src => src.DayOfWeek)
            .Map(dest => dest.StartTime, src => src.StartTime)
            .Map(dest => dest.EndTime, src => src.EndTime)
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.Code)
            .IgnoreNullValues(true);

        config.NewConfig<OperationalWindow, OperationalWindowDTO>();
        
    }
}