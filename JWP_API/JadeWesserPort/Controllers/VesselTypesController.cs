using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselTypeDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;
[Route("api/[controller]")]
[ApiController]
public class VesselTypesController(
    IVesselTypeRepository vesselTypeRepository, 
    IVesselTypeService vesselTypeService,
    IAuthService authService,
    IMapper mapper,
    ILogger<VesselTypesController> logger) : ControllerBase
{
    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] VesselTypeDto vesselTypeDto)
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
            var vesselType = mapper.Map<VesselType>(vesselTypeDto);
            vesselType.Id = Guid.NewGuid();

            var code = await vesselTypeRepository.CreateAsync(vesselType);

            return Ok(code);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("{code}")]
    public async Task<ActionResult<VesselTypeDto>> GetByIdAsync([FromRoute] string code)
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
            var vesselType = await vesselTypeRepository.FindByCodeAsync(code);

            if (vesselType is null)
            {
                return NotFound();
            }

            var result = mapper.Map<VesselTypeDto>(vesselType);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<VesselTypeDto>>> GetAllAsync()
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

        var vesselTypes = await vesselTypeRepository.GetAllAsync();

        var vesselTypeDTOs = mapper.Map<List<VesselTypeDto>>(vesselTypes);

        return Ok(vesselTypeDTOs);
    }
    
    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult<VesselTypeDto>> UpdateAsync([FromRoute] string code, [FromBody] VesselTypeUpdateDto vesselTypeUpdateDto)
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
            var vesselType = await vesselTypeRepository.UpdateAsync(code, vesselTypeUpdateDto);

            if (vesselType is null)
            {
                return NotFound();
            }

            var vesselTypeDto = mapper.Map<VesselTypeDto>(vesselType);

            return Ok(vesselTypeDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<VesselTypeDto>>> GetBySearchAsync(
        [FromQuery] string? name, 
        [FromQuery] string? description,
        [FromQuery] FilterOperator filterOperator)
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

        var vesselTypes = await vesselTypeService.GetBySearchAsync(name, description, filterOperator);

        var vesselTypeDtos = mapper.Map<List<VesselTypeDto>>(vesselTypes);

        return vesselTypeDtos;
    }
}