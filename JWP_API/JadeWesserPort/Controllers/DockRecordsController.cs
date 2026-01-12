using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.DockRecordDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DockRecordsController(
    IDockRecordRepository dockRecordRepository, 
    IDockRecordService dockRecordService,
    IAuthService authService,
    IMapper mapper,
    ILogger<DockRecordsController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] DockRecordCreationDto dockRecordDto)
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
            var dockRecord = mapper.Map<DockRecord>(dockRecordDto);
            
            dockRecord.Code = $"DCK-{Guid.NewGuid().ToString()[..8]}";

            if (dockRecordDto.VesselTypeCodes is { Count: > 0 })
            {
                var vesselTypes = await dockRecordRepository.GetVesselTypesByCodeAsync(dockRecordDto.VesselTypeCodes);

                if (vesselTypes.Count != dockRecordDto.VesselTypeCodes.Count)
                    return BadRequest("One or more vessel type names are invalid.");

                var invalidVessels = vesselTypes
                    .Where(v => v.Length > dockRecord.Length || v.Draft > dockRecord.MaxDraft)
                    .Select(v => v.Code)
                    .ToList();

                if (invalidVessels.Any())
                    return BadRequest($"The following vessel types cannot berth at this dock due to size restrictions: {string.Join(", ", invalidVessels)}");

                dockRecord.AllowedVesselTypes = vesselTypes;
            }

            var res = await dockRecordRepository.CreateAsync(dockRecord);
            return Ok(res);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("{code}")]
    public async Task<ActionResult<DockRecordDto>> GetByIdAsync([FromRoute] string code)
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

        var dockRecord = await dockRecordRepository.FindByCodeAsync(code);

        if (dockRecord is null)
        {
            return NotFound();
        }

        var dto = mapper.Map<DockRecordDto>(dockRecord);
        return Ok(dto);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<DockRecordDto>>> GetAllAsync()
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

        var dockRecords = await dockRecordRepository.GetAllAsync();

        var dockRecordDTOs = mapper.Map<List<DockRecordDto>>(dockRecords);

        return Ok(dockRecordDTOs);
    }

    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult> UpdateDockAsync(
        [FromRoute] string code,
        [FromBody] DockRecordUpdateDto dto)
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

        var dockRecord = await dockRecordRepository.FindByCodeAsync(code);
        if (dockRecord is null)
            return NotFound($"DockRecord with Code {code} not found.");

        mapper.Map(dto, dockRecord);

        if (dto.VesselTypeCodes is { Count: > 0 })
        {
            var vesselTypes = await dockRecordRepository.GetVesselTypesByCodeAsync(dto.VesselTypeCodes);

            if (vesselTypes.Count != dto.VesselTypeCodes.Count)
                return BadRequest("One or more vessel type names are invalid.");

            var invalidVessels = vesselTypes
                .Where(v => v.Length > dockRecord.Length || v.Draft > dockRecord.MaxDraft)
                .Select(v => v.Code)
                .ToList();

            if (invalidVessels.Any())
                return BadRequest($"The following vessel types cannot berth at this dock: {string.Join(", ", invalidVessels)}");

            dockRecord.AllowedVesselTypes = vesselTypes;
        }

        await dockRecordRepository.SaveChangesAsync();
        return Ok($"DockRecord '{dockRecord.Name}' updated successfully.");
    }


    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<DockRecordDto>>> GetBySearchAsync(
        [FromQuery] string? name,
        [FromQuery] string? vesselType,
        [FromQuery] string? location,
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

        var dockRecords = await dockRecordService.GetBySearchAsync(name, vesselType, location, filterOperator);

        var dockRecordDtos = mapper.Map<List<DockRecordDto>>(dockRecords);

        return dockRecordDtos;
    }
}