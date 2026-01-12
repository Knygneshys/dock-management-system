using JadeWesserPort.Domain;
using JadeWesserPort.Domain.ValueObjects;

namespace JadeWesserPort.Extensions;

public static class OperationalWindowExtensions
{
    public static TimeRange GetTimeRange(this OperationalWindow operationalWindow)
    {
        return new TimeRange(operationalWindow.StartTime, operationalWindow.EndTime);
    }
    
    public static bool OverlapsWith(this OperationalWindow window, OperationalWindow other)
    {
        if (window.DayOfWeek != other.DayOfWeek)
            return false;
            
        return window.GetTimeRange().OverlapsWith(other.GetTimeRange());
    }
    
    public static bool ContainsTime(this OperationalWindow window, TimeOnly time)
    {
        return window.GetTimeRange().Contains(time);
    }
}