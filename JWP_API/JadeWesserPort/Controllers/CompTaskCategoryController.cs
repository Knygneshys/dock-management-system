using JadeWesserPort.DTOs.CompTaskCategoryDTOs;
using JadeWesserPort.Intermediators;
using JadeWesserPort.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CompTaskCategoryController(
    OemIntermediator oemIntermediator,
    IAuthService authService,
    ILogger<CompTaskCategoryController> logger) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CompTaskCategoryDto>>> SearchCategories([FromQuery] CompTaskCategorySearchRequest request)
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

        var response = await oemIntermediator.SearchComplementaryTaskCategoriesAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }

    [HttpPost]
    public async Task<ActionResult<CompTaskCategoryDto?>> CreateCategory([FromBody] CompTaskCategoryDto request)
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

        var response = await oemIntermediator.CreateComplementaryTaskCategoryAsync(request);

        var body = await response.Content.ReadAsStringAsync();
        return StatusCode((int)response.StatusCode, body);
    }
}