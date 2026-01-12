using JadeWesserPort.Domain.Enums;
using System.Text.Json;
using JadeWesserPort.DTOs.PlanningDTOs;
using JadeWesserPort.DTOs.DailyScheduleDTOs;

namespace JadeWesserPort.Intermediators;

public class SchedulersIntermediator(HttpClient httpClient)
{
    private static readonly JsonSerializerOptions _jsonOptions = new() { PropertyNameCaseInsensitive = true };

    public async Task<DailyScheduleResponseDto> GetDailyScheduleAsync(DateOnly date, AlgorithmType algorithmType, int? computeTimeMS = null)
    {
        var url = $"/api/Planning/daily-schedule?date={date:yyyy-MM-dd}&algorithmType={algorithmType}";
        if (computeTimeMS.HasValue)
        {
            url += $"&computeTimeMS={computeTimeMS.Value}";
        }
        var response = await httpClient.GetAsync(url)
            ?? throw new Exception("Daily schedule not received!");

        var content = await response.Content.ReadAsStringAsync();

        DailyScheduleResponseDto result = JsonSerializer.Deserialize<DailyScheduleResponseDto>(content, _jsonOptions)
            ?? throw new Exception("Error deserializing single crane schedule");

        return result;
    }
    
    public async Task<RebalanceComparisonDto> GetRebalanceComparisonAsync(DateOnly date)
    {
        var response = await httpClient.GetAsync($"/api/Planning/rebalance-comparison?date={date:yyyy-MM-dd}")
                       ?? throw new Exception("Rebalance comparison not received!");

        var content = await response.Content.ReadAsStringAsync();

        RebalanceComparisonDto result = JsonSerializer.Deserialize<RebalanceComparisonDto>(content, _jsonOptions)
                                        ?? throw new Exception("Error deserializing rebalance comparison");

        return result;
    }
}
