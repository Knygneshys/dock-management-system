using Microsoft.AspNetCore.Mvc;
using JadeWesserPort.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using JadeWesserPort.Intermediators;
using JadeWesserPort.Services.Interfaces;
using JadeWesserPort.DTOs.PlanningDTOs;
using JadeWesserPort.DTOs.DailyScheduleDTOs;

namespace JadeWesserPort.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanningController(
        SchedulersIntermediator schedulersIntermediator, 
        ISchedulingService schedulingService) : ControllerBase
    {
        [Authorize]
        [HttpGet("daily")]
        public async Task<ActionResult<DailyScheduleResponseDto>> GetDaily(
            [FromQuery] DateOnly date, 
            [FromQuery] AlgorithmType algorithmType,
            [FromQuery] int? computeTimeMS)
        {
            try
            {
                var schedule = await schedulersIntermediator.GetDailyScheduleAsync(date, algorithmType, computeTimeMS);
                var scheduleWithOperations = await schedulingService.ScheduleOperationSequenceAsync(schedule);
                return Ok(scheduleWithOperations);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [Authorize]
        [HttpGet("rebalance-comparison")]
        public async Task<ActionResult<RebalanceComparisonDto>> GetRebalanceComparison([FromQuery] DateOnly date)
        {
            try
            {
                var result = await schedulersIntermediator.GetRebalanceComparisonAsync(date);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
