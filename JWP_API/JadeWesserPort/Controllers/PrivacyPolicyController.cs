using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PrivacyPolicyController(
    IPrivacyPolicyServices _privacyPolicyServices,
    IPrivacyPolicyRepository _privacyPolicyRepository,
    IMapper mapper
    ) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> PublishAsync([FromBody] PublishPrivacyPolicyCommand command)
    {
        try
        {
            return await _privacyPolicyServices.Publish(command);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpGet("newest")]
    public async Task<ActionResult<PrivacyPolicyResponseDto>> GetNewestAsync()
    {
        try
        {
            var newestPolicy = await _privacyPolicyRepository.GetNewestPolicy();

            if (newestPolicy is null)
            {
                return NotFound("There are no policies saved in the system!");
            }

            return mapper.Map<PrivacyPolicyResponseDto>(newestPolicy);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<PrivacyPolicyResponseDto>>> GetAllAsync()
    {
        try
        {
            var newestPolicies = await _privacyPolicyRepository.GetAllAsync();

            return mapper.Map<List<PrivacyPolicyResponseDto>>(newestPolicies);
        }
        catch (Exception exception)
        {
            return BadRequest(exception.Message);
        }
    }
}