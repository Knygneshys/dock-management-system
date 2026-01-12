using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.OperationalWindowDTOs;

namespace JWPTests.Providers;

public class OperationalWindowProvider
{
    private Guid _id { get; set; } = Guid.NewGuid();
    private Guid _staffMemberId { get; set; } = Guid.NewGuid();
    private DayOfWeek _dayOfWeek { get; set; } = DayOfWeek.Monday;
    private TimeOnly _startTime { get; set; } = new TimeOnly(9, 0);
    private TimeOnly _endTime { get; set; } = new TimeOnly(17, 0);
    private StaffMember _staffMember { get; set; } = null!;

    public OperationalWindowProvider WithId(Guid id)
    {
        _id = id;
        return this;
    }

    public OperationalWindowProvider WithStaffMemberId(Guid staffMemberId)
    {
        _staffMemberId = staffMemberId;
        return this;
    }

    public OperationalWindowProvider WithDayOfWeek(DayOfWeek dayOfWeek)
    {
        _dayOfWeek = dayOfWeek;
        return this;
    }

    public OperationalWindowProvider WithStartTime(TimeOnly startTime)
    {
        _startTime = startTime;
        return this;
    }

    public OperationalWindowProvider WithEndTime(TimeOnly endTime)
    {
        _endTime = endTime;
        return this;
    }

    public OperationalWindowProvider WithStaffMember(StaffMember staffMember)
    {
        _staffMember = staffMember;
        return this;
    }

    
    public OperationalWindow Provide()
    {
        return new OperationalWindow
        {
            Id = _id,
            StaffMemberId = _staffMemberId,  
            StaffMember = _staffMember,
            DayOfWeek = _dayOfWeek,
            StartTime = _startTime,
            EndTime = _endTime
           
        };
    }

    public OperationalWindowFormDTO ProvideDto()
    {
        return new OperationalWindowFormDTO
        {
            DayOfWeek = _dayOfWeek,
            StartHour = _startTime.Hour,
            StartMinute = _startTime.Minute,
            EndHour = _endTime.Hour,
            EndMinute = _endTime.Minute
        };
    }

    public OperationalWindowFormDTO ProvideDto(OperationalWindow operationalWindow)
    {
        return new OperationalWindowFormDTO
        {
            DayOfWeek = operationalWindow.DayOfWeek,
            StartHour = operationalWindow.StartTime.Hour,
            StartMinute = operationalWindow.StartTime.Minute,
            EndHour = operationalWindow.EndTime.Hour,
            EndMinute = operationalWindow.EndTime.Minute
        };
    }

    public List<OperationalWindow> ProvideList()
    {
        return
        [
            WithId(Guid.NewGuid()).WithDayOfWeek(DayOfWeek.Monday).Provide(),
            WithId(Guid.NewGuid()).WithDayOfWeek(DayOfWeek.Tuesday).Provide(),
            WithId(Guid.NewGuid()).WithDayOfWeek(DayOfWeek.Wednesday).Provide()
        ];
    }
}