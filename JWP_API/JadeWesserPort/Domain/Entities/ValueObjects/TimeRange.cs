namespace JadeWesserPort.Domain.ValueObjects;

public record TimeRange
{
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }

    public TimeRange(TimeOnly startTime, TimeOnly endTime)
    {
        if (endTime <= startTime)
            throw new ArgumentException("End time must be after start time");
            
        StartTime = startTime;
        EndTime = endTime;
    }

    public TimeRange(int startHour, int startMinute, int endHour, int endMinute)
        : this(new TimeOnly(startHour, startMinute), new TimeOnly(endHour, endMinute))
    {
    }
    
    public bool OverlapsWith(TimeRange other)
    {
        return StartTime < other.EndTime && EndTime > other.StartTime;
    }
    
    public bool Contains(TimeOnly time)
    {
        return time >= StartTime && time < EndTime;
    }

    public bool Contains(TimeRange other)
    {
        return StartTime <= other.StartTime && EndTime >= other.EndTime;
    }
}