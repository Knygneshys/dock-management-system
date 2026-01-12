using System.Security.Claims;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.IncidentTypeDTOs;
using JadeWesserPort.DTOs.IncidentTypeDTOs.Commands;
using JadeWesserPort.Intermediators;
using JadeWesserPort.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IncidentTypeController(
    OemIntermediator oemIntermediator,
    ILogger<IncidentType> logger,
    IAuthService authService
) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] CreateIncidentTypeCommand command)
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }
        
        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.LogisticsOperator))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }
        
        try
        {
            var result = await oemIntermediator.CreateIncidentTypeAsync(command);

            return Ok(result);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult<IncidentTypeResponseDto>> UpdateAsync([FromRoute] string code,
        [FromBody] UpdateIncidentTypeCommand command)
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }
        
        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.LogisticsOperator))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }
        
        try
        {
            var incidentTypeResponseDto = await oemIntermediator.UpdateIncidentTypeAsync(code, command);
    
            return Ok(incidentTypeResponseDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<IncidentTypeResponseDto>>> SearchAsync([FromQuery] string? code,
        [FromQuery] string? parentIncidentTypeCode, [FromQuery] string? description,
        [FromQuery] SeverityClassification? severity)
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }
        
        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.LogisticsOperator))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }
        
        try
        {
            var incidentTypeResponseDtos =
                await oemIntermediator.SearchIncidentTypesAsync(code, parentIncidentTypeCode, description, severity);

            return Ok(incidentTypeResponseDtos);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpGet("{code}")]
    public async Task<ActionResult<IncidentTypeResponseDto>> FindAsync([FromRoute] string code)
    {
        try
        {
            var incidentResponseDto = await oemIntermediator.FindIncidentTypeByCode(code);

            return Ok(incidentResponseDto);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

}