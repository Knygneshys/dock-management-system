using JadeWesserPort.DTOs.DockStorageDistanceDTOs.CompTasksDTOs;
using JadeWesserPort.Intermediators;
using Microsoft.AspNetCore.Mvc;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ComplementaryTaskController : ControllerBase
{
    private readonly OemIntermediator _oemIntermediator;

    public ComplementaryTaskController(OemIntermediator oemIntermediator)
    {
        _oemIntermediator = oemIntermediator;
    }

    [HttpPost]
    public async Task<ActionResult<ComplementaryTaskDto>> CreateComplementaryTask([FromBody] CreateComplementaryTaskDto dto)
    {
        try
        {
            var result = await _oemIntermediator.CreateComplementaryTaskAsync(dto);
            return CreatedAtAction(nameof(GetComplementaryTaskByCode), new { code = result.Code }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<ComplementaryTaskDto>>> GetAllComplementaryTasks()
    {
        try
        {
            var result = await _oemIntermediator.GetAllComplementaryTasksAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<List<ComplementaryTaskDto>>> SearchComplementaryTasks(
        [FromQuery] DateTime? start = null,
        [FromQuery] DateTime? end = null,
        [FromQuery] string? status = null)
    {
        try
        {
            var result = await _oemIntermediator.SearchComplementaryTasksAsync(start, end, status);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("vve/{vveCode}")]
    public async Task<ActionResult<List<ComplementaryTaskDto>>> GetComplementaryTasksByVve(int vveCode)
    {
        try
        {
            var result = await _oemIntermediator.GetComplementaryTasksByVveAsync(vveCode);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<ComplementaryTaskDto>> GetComplementaryTaskByCode(string code)
    {
        try
        {
            var result = await _oemIntermediator.GetComplementaryTaskByCodeAsync(code);
            return Ok(result);
        }
        catch (Exception ex)
        {
            if (ex.Message.Contains("not found"))
            {
                return NotFound(new { error = ex.Message });
            }
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{code}")]
    public async Task<ActionResult> UpdateComplementaryTask(string code, [FromBody] UpdateComplementaryTaskDto dto)
    {
        try
        {
            await _oemIntermediator.UpdateComplementaryTaskAsync(code, dto);
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Update] Error: {ex.Message}"); // ✅ Log
            if (ex.Message.Contains("not found"))
            {
                return NotFound(new { error = ex.Message });
            }
            return BadRequest(new { error = ex.Message });
        }
    }
}