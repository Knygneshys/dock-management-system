using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VesselDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Services.Interfaces;
using JWPTests.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VesselsController(
    ICompanyRepository companyRepository,
    IVesselRepository vesselRepository,
    IVesselTypeRepository vesselTypeRepository,
    IVesselService vesselService,
    IAuthService authService,
    IMapper mapper,
    ILogger<VesselsController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] VesselCreateDto dto)
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

        var imoIsValid = vesselService.CheckIfImoNumberIsValidAsync(dto.Imo);
        if (!imoIsValid)
        {
            return BadRequest("Invalid IMO number.");
        }

        try
        {
            var vessel = mapper.Map<Vessel>(dto);
            vessel.Type = await dto.DTOVesselTypeCodeToVesselType(vesselTypeRepository);
            vessel.Owner = await dto.DTOOwnerCodeToCompany(companyRepository);
            vessel.Operator = await dto.DTOOperatorCodeToCompany(companyRepository);
            vessel.Id = Guid.NewGuid();
            return await vesselRepository.CreateAsync(vessel);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<VesselDto>>> GetAllAsync()
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }

        if (!await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.PortAuthorityOfficer)
            && !await authService.UserIsAuthorizedByAuth0IdAsync(auth0Id, Domain.System.UserRole.ShippingAgentRepresentative))
        {
            logger.LogWarning("User {Id} tried to access controller!", auth0Id);
            return Forbid();
        }

        var vessels = await vesselRepository.GetAllAsync();

        var vesselDtos = mapper.Map<IEnumerable<VesselDto>>(vessels);

        return Ok(vesselDtos);
    }

    [Authorize]
    [HttpPut]
    [Route("{imo}")]
    public async Task<ActionResult<VesselCreateDto>> UpdateAsync([FromRoute] string imo, [FromBody] VesselUpdateDto vesselUpdateDto)
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
            var imoIsValid = vesselService.CheckIfImoNumberIsValidAsync(vesselUpdateDto.Imo);
            if (!imoIsValid)
            {
                return BadRequest("Invalid IMO number.");
            }

            var vesselType = await vesselRepository.UpdateAsync(imo, vesselUpdateDto);

            if (vesselType is null)
            {
                return NotFound();
            }

            var vesselDto = mapper.Map<VesselUpdateDto>(vesselType);

            return Ok(vesselDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{imo}")]
    public async Task<ActionResult<VesselDto>> GetByImoAsync([FromRoute] string imo)
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

        var vessel = await vesselRepository.GetByImoAsync(imo);

        if (vessel is null)
        {
            return NotFound();
        }

        var vesselDto = mapper.Map<VesselDto>(vessel);

        return vesselDto;
    }
    
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<VesselDto>>> GetBySearchAsync(
        [FromQuery] string? imo,
        [FromQuery] string? name, 
        [FromQuery] string? operatorCode,
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

        var vessels = await vesselService.GetBySearchAsync(imo, name, operatorCode, filterOperator);

        var vesselDtos = mapper.Map<List<VesselDto>>(vessels);

        return vesselDtos;
    }
}