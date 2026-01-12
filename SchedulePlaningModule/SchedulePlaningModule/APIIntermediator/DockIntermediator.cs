using SchedulePlanning.DTOs;

namespace SchedulePlanning.APIIntermediator;

public class DockIntermediator(HttpClient httpClient)
{
    public async Task<List<DockRecordDto>> GetDocksFromApiAsync()
    {
        var docks = await httpClient.GetFromJsonAsync<List<DockRecordDto>>("api/DockRecords")
                    ?? throw new Exception("Docks not received!");

        return docks;
    }
}