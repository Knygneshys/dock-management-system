using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.ShiftDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class ShiftMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<ShiftCreateDto, Shift>()
            .IgnoreNullValues(true);
        config.NewConfig<Shift, ShiftDto>()
            .Map(dst => dst.From, src => $"{src.From.ToShortDateString()} {src.From.ToShortTimeString()}")
            .Map(dst => dst.To, src => $"{src.To.ToShortDateString()} {src.To.ToShortTimeString()}")
            .Map(dst => dst.ResourceCode, src => src.Resource.AlphanumericCode)
            .Map(dst => dst.StaffMNumber, src => src.StaffMember.MecanographicNumber);
    }
}
