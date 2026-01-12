using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.ShippingAgentRepresentativeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ShippingAgentRepresentativesController(
    IMapper mapper, 
    IShippingAgentRepService service,
    IAuthService authService,
    ILogger<ShippingAgentRepresentativesController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] ShippingAgentRepresentativeDTO dto)
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

        try
        {
            var email = await service.CreateAsync(dto);
            return Ok(email);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<ShippingAgentRepresentative>>> GetAllAsync()
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

        var representatives = await service.GetAllAsync();
        var dtos = mapper.Map<List<ShippingAgentRepresentativeDTO>>(representatives);
        return Ok(dtos);
    }

    [Authorize]
    [HttpGet("notifications")]
    public async Task<ActionResult<List<VVNDto>>> GetSARVVNsAsync()
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }

        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.ShippingAgentRepresentative))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }

        try
        {
            var email = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            var ret = await service.GetSARVVNsAsync(email);
            return Ok(ret);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}