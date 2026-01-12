using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities.Resources;
using JadeWesserPort.Domain.Enums;
using JadeWesserPort.DTOs.ResourceDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResourcesController(
    IResourceRepository resourceRepository, 
    IQualificationRepository qualificationRepository, 
    IDockRecordRepository dockRecordRepository,
    IStorageAreaRepository storageAreaRepository,
    IMapper mapper, 
    IResourceService resourceService,
    IAuthService authService,
    ILogger<ResourcesController> logger) : ControllerBase
{
    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync(
        [FromBody]ResourceCreateDTO resourceDTO)
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
            switch (resourceDTO.ResourceType)
            {
                case ResourceTypes.STSCrane:
                    var crane = new STSCrane
                    {
                        DockRecord = await resourceDTO.DTODockCodeToDockRecordAsync(dockRecordRepository)
                    };
                    mapper.Map(resourceDTO, crane);

                    crane.Qualifications.AddRange(await resourceDTO.DTOStringsToQualificationList(qualificationRepository));

                    var craneCode = await resourceRepository.CreateAsync(crane);

                    return Ok(craneCode);
                case ResourceTypes.YardCrane:
                    var yardCrane = new YardCrane
                    {
                        StorageArea = await resourceDTO.DTOStorageAreaCodeToStorageAreaAsync(storageAreaRepository)
                    };
                    mapper.Map(resourceDTO, yardCrane);

                    yardCrane.Qualifications.AddRange(await resourceDTO.DTOStringsToQualificationList(qualificationRepository));

                    var yardCode = await resourceRepository.CreateAsync(yardCrane);

                    return Ok(yardCode);
                case ResourceTypes.TerminalTruck:
                    var truck = new TerminalTruck();
                    mapper.Map(resourceDTO, truck);

                    truck.Qualifications.AddRange(await resourceDTO.DTOStringsToQualificationList(qualificationRepository));

                    var truckCode = await resourceRepository.CreateAsync(truck);

                    return Ok(truckCode);
                default:
                    return BadRequest("Invalid resource type.");
            }
        }
        catch(KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
    [HttpGet("{code}")]
    public async Task<ActionResult<ResourceDTO>> GetByCodeAsync(
        [FromRoute] string code)
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

        var resource = await resourceRepository.FindByCodeAsync(code);
        if (resource is null)
        {
            return NotFound();
        }
        var resourceDTO = mapper.Map<ResourceDTO>(resource);

        return Ok(resourceDTO);
    }

    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
[HttpGet]
public async Task<ActionResult<List<ResourceDTO>>> GetByFilterAsync(
        [FromQuery] string? description, 
        [FromQuery] ResourceTypes? type, 
        [FromQuery] ResourceStatus? status
    )
{
    if (User.Identity?.AuthenticationType == "ApiKey")
    {
        try
        {
            var resources = await resourceService.GetByFilterAsync(description, type, status);

            if (resources is null || !resources.Any())
            {
                return NotFound();
            }

            var resourceDTOs = mapper.Map<List<ResourceDTO>>(resources);
            return Ok(resourceDTOs);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

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
        var resources = await resourceService.GetByFilterAsync(description, type, status);

        if (resources is null || !resources.Any())
        {
            return NotFound();
        }

        var resourceDTOs = mapper.Map<List<ResourceDTO>>(resources);
        return Ok(resourceDTOs);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
}

    [Authorize]
    [HttpPut("{code}/reactivate")]
    public async Task<ActionResult> ReactivateAsync(
        [FromRoute] string code)
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

        var resource = await resourceRepository.FindByCodeAsync(code);
        if (resource is null)
        {
            return NotFound();
        }

        if (resource.Status == ResourceStatus.Active)
        {
            return BadRequest("Resource is already active.");
        }

        await resourceRepository.UpdateStatusAsync(code, ResourceStatus.Active);
        return Ok();
    }

    [Authorize]
    [HttpPut("{code}/deactivate")]
    public async Task<ActionResult> DeactivateAsync(
        [FromRoute] string code)
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

        var resource = await resourceRepository.FindByCodeAsync(code);
        if (resource is null)
        {
            return NotFound();
        }

        if (resource.Status == ResourceStatus.Inactive)
        {
            return BadRequest("Resource is already inactive.");
        }

        await resourceRepository.UpdateStatusAsync(code, ResourceStatus.Inactive);
        return Ok();
    }
}
