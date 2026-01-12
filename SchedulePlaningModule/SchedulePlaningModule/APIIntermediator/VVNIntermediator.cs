using SchedulePlanning.DTOs;

namespace SchedulePlanning.APIIntermediator;

public class VVNIntermediator(HttpClient httpClient)
{
    public async Task<List<VVNDto>> GetVVNsFromApiAsync(DateOnly date)
    {
        var dayStart = date.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var dayEnd = dayStart.AddDays(1);

        var startStr = dayStart.ToString("yyyy-MM-ddTHH:mm:ss");
        var endStr = dayEnd.ToString("yyyy-MM-ddTHH:mm:ss");

        var visits = await httpClient.GetFromJsonAsync<List<VVNDto>>(
            $"api/VesselVisitNotifications/overlapping?start={startStr}&end={endStr}")
            ?? throw new Exception("VVNs not received!");

        return visits;
    }
}
