using SchedulePlanning.DTOs;

namespace SchedulePlanningTests.UnitTests.Helpers;

internal static class OperationalWindowProvider
{
    public static OperationalWindowDto OpWinForStartAndEndTime(int start, int end)
    {
        var (dayOfWeek, startTime) = ConvertAbsoluteHourToDayAndTime(start);
        var (_, endTime) = ConvertAbsoluteHourToDayAndTime(end);

        return new OperationalWindowDto
        {
           DayOfWeek = dayOfWeek.ToString(),
           StartTime = startTime,
           EndTime = endTime,
        };
    }

    private static (DayOfWeek dayOfWeek, TimeSpan time) ConvertAbsoluteHourToDayAndTime(int absoluteHour)
    {
        if (absoluteHour < 0 || absoluteHour >= 168)
            throw new ArgumentOutOfRangeException(nameof(absoluteHour), "Hour must be between 0 and 167");

        int dayIndex = absoluteHour / 24;
        int hourInDay = absoluteHour % 24;

        DayOfWeek dayOfWeek = dayIndex switch
        {
            0 => DayOfWeek.Monday,
            1 => DayOfWeek.Tuesday,
            2 => DayOfWeek.Wednesday,
            3 => DayOfWeek.Thursday,
            4 => DayOfWeek.Friday,
            5 => DayOfWeek.Saturday,
            6 => DayOfWeek.Sunday,
            _ => throw new InvalidOperationException("Invalid day index")
        };

        return (dayOfWeek, TimeSpan.FromHours(hourInDay));
    }
}
