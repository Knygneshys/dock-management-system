using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DockStorageDistancesController(
    IDockStorageDistanceRepository distanceRepository,
    IDockRecordRepository dockRepository,
    IStorageAreaRepository storageRepository,
    IAuthService authService,
    IMapper mapper,
    ILogger<DockStorageDistancesController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync(
        [FromBody] DockStorageDistanceDto dto)
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

        var dock = await dockRepository.FindByCodeAsync(dto.DockCode);
        if (dock is null)
            return NotFound($"Dock with code '{dto.DockCode}' not found.");

        var storage = await storageRepository.FindByCodeAsync(dto.StorageAreaCode);
        if (storage is null)
            return NotFound($"Storage area with code '{dto.StorageAreaCode}' not found.");

        var existing = await distanceRepository.FindByCodeAsync(dto.Code);
        if (existing is not null)
            return Conflict($"A DockStorageDistance with code '{dto.Code}' already exists.");

        var entity = new DockStorageDistance
        {
            Id = Guid.NewGuid(),
            Code = dto.Code,
            DockRecordId = dock.Id,
            StorageAreaId = storage.Id,
            DistanceMeters = dto.DistanceMeters,
            Notes = dto.Notes
        };
        try
        {
            await distanceRepository.CreateAsync(entity);
            return Ok(entity.Code);
        }
        catch (Exception ex) 
        {
            return BadRequest(ex.Message);  
        }
    }

    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult<DockStorageDistanceDto>> UpdateAsync(
        [FromRoute] string code,
        [FromBody] DockStorageDistanceDto dto)
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

        var existing = await distanceRepository.FindByCodeAsync(code);
        if (existing is null)
            return NotFound($"DockStorageDistance with code '{code}' not found.");

        existing.DistanceMeters = dto.DistanceMeters;
        existing.Notes = dto.Notes;

        try
        {
            await distanceRepository.UpdateAsync(existing);

            var updatedDto = mapper.Map<DockStorageDistanceDto>(existing);
            return Ok(updatedDto);
        }
        catch (Exception ex) 
        {
            return BadRequest(ex.Message);
        }
    }
}
