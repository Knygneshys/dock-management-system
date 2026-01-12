using JadeWesserPort.DTOs.VVEDTOs;
using JadeWesserPort.DTOs.ExecutedOperationDTOs;
using JadeWesserPort.Intermediators;
using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VVEController(OemIntermediator oemIntermediator) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<VVEDto>>> GetAllVVEs()
        {
            try
            {
                var result = await oemIntermediator.GetAllVVEsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<VVEDto>>> SearchVVEs(
            [FromQuery] DateTime? start = null,
            [FromQuery] string? vesselImo = null,
            [FromQuery] string? status = null)
        {
            try
            {
                var result = await oemIntermediator.SearchVVEsAsync(start, vesselImo, status);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        
        [HttpGet("{code:int}")]
        public async Task<ActionResult<List<ExecutedOperationResponseDto>>> GetExecutedOperationsByVveCode([FromRoute] int code){
            try
            {
                var result = await oemIntermediator.GetExecutedOperationsByVveCode(code);

                return Ok(result);
            }
            catch(Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }

        [HttpPut("add-executed-operation/{code:int}")]
        public async Task<ActionResult<VVEDto>> AddExecutedOperation(
            [FromRoute] int code,
            [FromBody] CreateExecutedOperationCommand command)
        {
            try
            {
                var result = await oemIntermediator.AddExecutedOperationToVve(code, command);

                return Ok(result);
            }
            catch (Exception exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}