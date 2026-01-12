using SchedulePlanning.DTOs;

namespace SchedulePlanning.APIIntermediator;

public class StaffIntermediator(HttpClient httpClient)
{
    public async Task<List<StaffDto>> GetStaffFromApiAsync()
    {
        return await httpClient.GetFromJsonAsync<List<StaffDto>>("api/StaffMembers")
            ?? throw new Exception("Staffs not received!");
    }
}
