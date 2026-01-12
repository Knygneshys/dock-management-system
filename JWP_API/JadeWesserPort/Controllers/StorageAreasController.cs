using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.StorageAreaDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StorageAreasController(
    IStorageAreaRepository repository,
    IDockRecordRepository dockRepository,
    IDockStorageDistanceRepository dockStorageDistanceRepository,
    IAuthService authService,
    IMapper mapper,
    ILogger<StorageAreasController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync(
        [FromBody] StorageAreaCreationDto dto)
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

        if (dto.CurrentOccupancy > dto.MaxCapacity)
            return BadRequest("Current occupancy cannot exceed maximum capacity.");

        var existing = await repository.FindByCodeAsync(dto.Code);
        if (existing is not null)
            return Conflict($"A storage area with code '{dto.Code}' already exists.");

        var entity = mapper.Map<StorageArea>(dto);

        var allDocks = await dockRepository.GetAllQueryable().ToListAsync();
        entity.Docks = allDocks;

        await repository.CreateAsync(entity);

        foreach (var dock in allDocks)
        {
            var link = new DockStorageDistance
            {
                Code = $"DSD-{dock.Code}-{entity.Code}",
                DockRecordId = dock.Id,
                StorageAreaId = entity.Id,
                DistanceMeters = 0,
                Notes = "Auto-generated default distance"
            };

            await dockStorageDistanceRepository.CreateAsync(link);
        }

        return Ok(entity.Code);
    }

    [Authorize]
    [HttpGet("{code}")]
    public async Task<ActionResult<StorageAreaDto>> GetByIdAsync([FromRoute] string code)
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

        var entity = await repository.FindByCodeAsync(code);
        if (entity is null)
            return NotFound($"Storage area with code '{code}' not found.");

        var dto = mapper.Map<StorageAreaDto>(entity);
        return Ok(dto);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<StorageAreaDto>>> GetAllAsync()
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

        var areas = await repository.GetAllQueryable().ToListAsync();
        var dtos = mapper.Map<List<StorageAreaDto>>(areas);
        return Ok(dtos);
    }

    [Authorize]
    [HttpPut("{code}")]
    public async Task<ActionResult> UpdateAsync(
        [FromRoute] string code,
        [FromBody] StorageAreaUpdateDto dto)
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

        var existing = await repository.FindByCodeAsync(code);
        if (existing is null)
            return NotFound($"Storage area with code '{code}' not found.");

        if (dto.CurrentOccupancy > dto.MaxCapacity)
            return BadRequest("Current occupancy cannot exceed maximum capacity.");

        mapper.Map(dto, existing);

        await repository.UpdateAsync(existing);

        return Ok($"StorageArea '{existing.Code}' updated successfully.");
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<List<StorageAreaDto>>> SearchAsync(
        [FromQuery] string? location,
        [FromQuery] StorageAreaType? type)
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

        var query = repository.GetAllQueryable();

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(sa => sa.Location.ToLower().Contains(location.ToLower()));

        if (type.HasValue)
            query = query.Where(sa => sa.Type == type.Value);

        var areas = await query.ToListAsync();
        var dtos = mapper.Map<List<StorageAreaDto>>(areas);

        return Ok(dtos);
    }
}
