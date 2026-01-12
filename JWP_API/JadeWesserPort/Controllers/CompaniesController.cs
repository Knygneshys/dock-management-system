using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CompanyDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CompaniesController(
    ICompanyRepository companyRepository,
    IAuthService authService,
    IMapper mapper,
    ILogger<CompaniesController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<string>> CreateAsync([FromBody] CompanyDto dto)
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
            var company = mapper.Map<Company>(dto);

            var code = await companyRepository.CreateAsync(company);

            return Ok(code);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetAllAsync()
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
            var companies = await companyRepository.GetAllAsync();
            var companyDtos = mapper.Map<IEnumerable<CompanyDto>>(companies);

            return Ok(companyDtos);
        }catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}