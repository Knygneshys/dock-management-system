using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.QualificationDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QualificationsController(
    IQualificationRepository qualificationRepository, 
    IMapper mapper, 
    IQualificationService qualificationService,
    IAuthService authService,
    ILogger<QualificationsController> logger) : ControllerBase
{

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] QualificationDTO qualificationDto)
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
            var qualification = mapper.Map<Qualification>(qualificationDto);
            var res = await qualificationRepository.CreateAsync(qualification);

            return Ok(res);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult<Qualification>> UpdateAsync([FromRoute] string code, [FromBody] UpdateQualificationDTO updateQualificationDto)
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
            var qualification = mapper.Map<Qualification>(updateQualificationDto);
            qualification.UpdatedAt = DateTime.UtcNow;
            var isSuccess = await qualificationRepository.UpdateAsync(code, updateQualificationDto);

            if (!isSuccess)
            {
                return NotFound();
            }

            return Ok(updateQualificationDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<Qualification>>> GetAllAsync()
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

        var list = await qualificationRepository.GetAllAsync();
        return Ok(list);
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<QualificationDTO>>> GetBySearchAsync(
        [FromQuery] string? name, 
        string? code,
        string? operatorType)
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

        if (operatorType != "contains" && operatorType != "equals" && operatorType is not null)
        {
            return BadRequest();
        }

        var result = await qualificationService.GetBySearchAsync(name, code, operatorType);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("{code}")]
    public async Task<ActionResult<Qualification>> GetByIdAsync([FromRoute] string code)
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
            var qualification = await qualificationRepository.GetByCodeAsync(code);

            if (qualification is null)
            {
                return NotFound();
            }

            var result = mapper.Map<QualificationDTO>(qualification);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
        
    }
}
