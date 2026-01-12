using JadeWesserPort.DTOs.IncidentDTOs;
using JadeWesserPort.Intermediators;
using JadeWesserPort.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IncidentsController(
    OemIntermediator oemIntermediator,
    IAuthService authService,
    ILogger<IncidentsController> logger) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<IncidentDto>>> SearchIncidents([FromQuery] IncidentSearchRequest request)
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

        var response = await oemIntermediator.SearchIncidentsAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<List<IncidentDto>>> CreateIncident([FromBody] CreateIncidentCommand request)
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

        var response = await oemIntermediator.CreateIncidentAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }

    [Authorize]
    [HttpPost("associate-vve")]
    public async Task<ActionResult<List<IncidentDto>>> AssociateVVEtoIncident([FromBody] VVEtoIncidentCommand request)
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

        var response = await oemIntermediator.AssociateVVEtoIncidentAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }

    [Authorize]
    [HttpDelete("detach-vve")]
    public async Task<ActionResult<List<IncidentDto>>> DetachVVEfromIncident([FromBody] VVEtoIncidentCommand request)
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

        var response = await oemIntermediator.DetachVVEfromIncidentAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }

    [Authorize]
    [HttpPatch("{code}/resolve")]
    public async Task<ActionResult<List<IncidentDto>>> ResolveIncident([FromRoute] string code)
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

        var response = await oemIntermediator.ResolveIncidentAsync(code);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }
}
