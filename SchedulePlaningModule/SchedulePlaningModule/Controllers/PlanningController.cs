using Microsoft.AspNetCore.Mvc;
using SchedulePlanning.APIIntermediator;
using SchedulePlanning.DTOs;
using SchedulePlanning.Enums;
using SchedulePlanning.Services.Interfaces;


namespace SchedulePlanning.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PlanningController(
    IPlanningService planningService,
    VVNIntermediator vVNIntermediator,
    StaffIntermediator staffIntermediator,
    DockIntermediator dockIntermediator) : ControllerBase
{

    [HttpGet("daily-schedule")]
    public async Task<ActionResult<DailyScheduleResponseDto>> GetDaily(
        [FromQuery] DateOnly date, 
        [FromQuery] AlgorithmType algorithmType,
        [FromQuery] int? computeTimeMS)
    {
        try
        {
            var vvns = await vVNIntermediator.GetVVNsFromApiAsync(date);
            var staffs = await staffIntermediator.GetStaffFromApiAsync();
            int? timeLimit = computeTimeMS;
            var result = await planningService.GenerateDailyScheduleAsync(date, algorithmType, vvns, staffs, timeLimit);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
    
    [HttpGet("rebalance-comparison")]
    public async Task<ActionResult<RebalanceComparisonDto>> GetRebalanceComparison([FromQuery] DateOnly date)
    {
        try
        {
            var vvns = await vVNIntermediator.GetVVNsFromApiAsync(date);
            var staffs = await staffIntermediator.GetStaffFromApiAsync();
            var docks = await dockIntermediator.GetDocksFromApiAsync();
        
            var result = await planningService.GenerateRebalanceComparisonAsync(date, vvns, staffs, docks);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
