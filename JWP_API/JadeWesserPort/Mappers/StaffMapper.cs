using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.OperationalWindowDTOs;
using JadeWesserPort.DTOs.StaffDTOs;
using Mapster;

namespace JadeWesserPort.Mappers;

public class StaffMapper : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<StaffMember, StaffDTO>();

        config.NewConfig<StaffCreateDTO, StaffMember>()
            .IgnoreNullValues(true);

        config.NewConfig<StaffUpdateDTO, StaffMember>()
            .IgnoreNullValues(true)
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.MecanographicNumber)
            .Ignore(dest => dest.Qualifications)
            .Ignore(dest => dest.OperationalWindows)
            .Ignore(dest => dest.Shifts);
    }
}
