namespace JadeWesserPort.Utils;

public static class DateTimeUtils
{
    /// <summary>
    /// Compares 2 time periods (t1 and t2) and verifies overlaping
    /// </summary>
    /// <param name="start1">t1 start</param>
    /// <param name="end1">t1 end</param>
    /// <param name="start2">t2 start</param>
    /// <param name="end2">t2 end</param>
    /// <returns>true if they overlap</returns>
    public static bool Overlaps(DateTime t1start, DateTime t1end, DateTime t2start, DateTime t2end)
    {
        if(DateTime.Compare(t1start, t2end) <= 0 && DateTime.Compare(t2start, t1end) <= 0)
            return true;
        return false;
    }

    /// <summary>
    /// Compares 2 time periods (t1 and t2) and verifies if t1 fits inside t2
    /// </summary>
    /// <param name="start1">t1 start</param>
    /// <param name="end1">t1 end</param>
    /// <param name="start2">t2 start</param>
    /// <param name="end2">t2 end</param>
    /// <returns>true if t1 is inside t2</returns>
    public static bool T1InsideT2(TimeOnly t1start, TimeOnly t1end, TimeOnly t2start, TimeOnly t2end)
    {
        if (t1start.CompareTo(t2start) >= 0 && t1end.CompareTo(t2end) <= 0) 
            return true;
        return false;
    }
}
