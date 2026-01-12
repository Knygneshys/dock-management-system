using System.Security.Claims;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.OperationPlanDTOs;
using JadeWesserPort.Intermediators;
using JadeWesserPort.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OperationPlanController(
    OemIntermediator oemIntermediator,
    ILogger<OperationPlan> logger,
    IAuthService authService,
    IOperationPlanService operationPlanService) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] CreateOperationPlanCommand command)
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
            var result = await oemIntermediator.CreateOperationPlanAsync(command);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{vvnCode:int}")]
    public async Task<ActionResult<OperationPlan>> UpdateAsync([FromRoute] int vvnCode, [FromBody] UpdateOperationPlanCommand command)
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
            await operationPlanService.ValidateUpdateOperationPlanCommand(vvnCode, command);
    
            var operationPlan = await oemIntermediator.UpdateOperationPlanAsync(vvnCode, command);
    
            return Ok(operationPlan);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [Authorize]
    [HttpDelete("by-date/{date}")]
    public async Task<ActionResult> DeleteByDateAsync([FromRoute] string date)
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
            await oemIntermediator.DeleteOperationPlansByDateAsync(date);
        
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<OperationPlanResponseDto>>> SearchPlans(
        [FromQuery] OperationPlanSearchRequest request)
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }

        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.PortAuthorityOfficer))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }

        var response = await oemIntermediator.SearchOperationPlansAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }
    
    [Authorize]
    [HttpGet("{vvnCode:int}")]
    public async Task<ActionResult<OperationPlan>> GetByCodeAsync([FromRoute] int vvnCode)
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
            var operationPlan = await oemIntermediator.GetOperationPlanByCode(vvnCode);
    
            return Ok(operationPlan);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
}