using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CrewMembeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JadeWesserPort.DTOs.VVNFeedbackDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using NSubstitute.Exceptions;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VesselVisitNotificationsController(
    IVVNRepository vvnRepository,
    IMapper mapper,
    IAuthService authService,
    IVVNService service,
    ILogger<VesselVisitNotificationsController> logger) : ControllerBase
{
    [Authorize]
    [HttpPost("maintence-vvn")]
    public async Task<ActionResult<int>> CreateMainteneceAsync(
        [FromBody] VVNCreateDTO vvnDto)
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
            var vvn = await service.CreateBaseVVNAsync(vvnDto, email);
            var res = await service.PersistVVNAsync(vvn);
            return Ok(res);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("load-vvn")]
    public async Task<ActionResult<int>> CreateLoadAsync(
        [FromBody] LoadVVNCreateDTO vvnDto)
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
            VesselVisitNotification vvn = await service.CreateBaseVVNAsync(vvnDto, email);
            await service.AddLoadManifestFromDtoToVVNAsync(vvn, vvnDto.CargoManifestDTO);
            var res = await service.PersistVVNAsync(vvn);

            return Ok(res);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }   
    }

    [Authorize]
    [HttpPost("unload-vvn")]
    public async Task<ActionResult<int>> CreateUnloadAsync(
        [FromBody] UnloadVVNCreateDTO vvnDto)
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
            VesselVisitNotification vvn = await service.CreateBaseVVNAsync(vvnDto, email);
            service.AddUnloadManifestFromDtoToVVNAsync(vvn, vvnDto.CargoManifestDTO);
            var res = await service.PersistVVNAsync(vvn);

            return Ok(res);
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

    [Authorize]
    [HttpPost("full-vvn")]
    public async Task<ActionResult<int>> CreateFullAsync(
    [FromBody] FullVVNCreateDTO vvnDto)
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
            VesselVisitNotification vvn = await service.CreateBaseVVNAsync(vvnDto, email);
            service.AddUnloadManifestFromDtoToVVNAsync(vvn, vvnDto.CargoUnloadManifestDTO);
            await service.AddLoadManifestFromDtoToVVNAsync(vvn, vvnDto.CargoLoadManifestDTO);
            var res = await service.PersistVVNAsync(vvn);

            return Ok(res);
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

    [Authorize]
    [HttpGet("{code:int}")]
    public async Task<ActionResult<VVNDto>> GetByCodeAsync([FromRoute] int code)
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
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound();

            var vvnDto = mapper.Map<VVNDto>(vvn);
            return Ok(vvnDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<VVNDto>>> GetAllAsync()
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

        var vvns = await vvnRepository.GetAllAsync();
        var vvnsDto = mapper.Map<List<VVNDto>>(vvns);
        return Ok(vvnsDto);
    }

    [Authorize]
    [HttpPut("{code:int}")]
    public async Task<ActionResult<VVNDto>> UpdateAsync(int code, [FromBody] VVNEditDto vvnDto)
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
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound($"VVN with code {code} not found");
            if(!vvn.Status.Equals(VVNStatus.InProgress))
                return BadRequest("Only InProgress VVNs can be updated");
            mapper.Map(vvnDto, vvn);
            vvn.Status = VVNStatus.Submitted;
            await vvnRepository.SaveChangesAsync();

            var updatedDto = new VVNDto();
            mapper.Map(vvn, updatedDto);
            return Ok(updatedDto);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Authorize]
    [HttpPut("{code:int}/send-back")]
    public async Task<ActionResult<VVNFeedbackDTO>> InProgressVVN(
        [FromRoute] int code,
        [FromBody] VVNFeedbackDTO feedbackDto)
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
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound("VVN not found");

            if (!vvn.Status.Equals(VVNStatus.Submitted))
                return BadRequest(
                    $"Cannot change status to InProgress. Current status is {vvn.Status}. Only Submitted VVNs can be moved to InProgress.");

            vvn.Status = VVNStatus.InProgress;
            var vvnFeedback = new VVNFeedback();
            mapper.Map(feedbackDto, vvnFeedback);
            vvnFeedback.OfficerId = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            vvnFeedback.Type = VVNStatus.InProgress;
            vvnFeedback.CreatedAt = DateTime.UtcNow;

            vvn.FeedBack = vvnFeedback;
            await vvnRepository.SaveChangesAsync();

            return Ok(feedbackDto);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{code:int}/reject")]
    public async Task<ActionResult<VVNFeedbackDTO>> RejectVVN(
        [FromRoute] int code,
        [FromBody] VVNFeedbackDTO feedbackDto)
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
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound("VVN not found");

            if (!vvn.Status.Equals(VVNStatus.Submitted) && !vvn.Status.Equals(VVNStatus.InProgress))
                return BadRequest(
                    $"Cannot eject VVN. Current status is {vvn.Status}. Only Submitted or In Progress VVN's can be rejected.");

            vvn.Status = VVNStatus.Rejected;
            var vvnFeedback = new VVNFeedback();
            mapper.Map(feedbackDto, vvnFeedback);
            vvnFeedback.OfficerId = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            vvnFeedback.Type = VVNStatus.Rejected;
            vvnFeedback.CreatedAt = DateTime.UtcNow;

            vvn.FeedBack = vvnFeedback;
            await vvnRepository.SaveChangesAsync();

            return Ok(feedbackDto);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{code:int}/aprove")]
    public async Task<ActionResult<VVNDto>> ApproveVVN(
        [FromRoute] int code,
        [FromBody] VVNFeedbackDTO feedbackDto)
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
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound("VVN not found");

            if (!vvn.Status.Equals(VVNStatus.Submitted) && !vvn.Status.Equals(VVNStatus.InProgress))
                return BadRequest(
                    $"Cannot approve VVN. Current status is {vvn.Status}. Only Submitted or InProgress VVNs can be approved.");

            if (vvn.Vessel?.Type is null)
                return BadRequest("Vessel or VesselType not found");

            var officerId = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            var retDto = await service.AcceptVVNAsync(vvn, feedbackDto, officerId);

            return Ok(retDto);

        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("{code:int}/crew-manifest")]
    public async Task<ActionResult<List<CrewMemberDTO>>> AddCrewManifestToVVN(
        [FromRoute] int code,
        [FromBody] List<CrewMemberDTO> crewMembers
        )
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
            var ret = await service.AddCrewMembersAsync(code, crewMembers);
            return Ok(ret);
        } catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        } catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
    [HttpGet("overlapping")]
    public async Task<ActionResult<List<VVNDto>>> GetOverlappingAsync(DateTime start, DateTime end)
    {
        var overlappingVisits = await vvnRepository.GetOverlappingAsync(start, end);

        var overlappingDto = mapper.Map<List<VVNDto>>(overlappingVisits);

        return Ok(overlappingDto);
    }
    
    [HttpPatch("{code:int}/status")]
    public async Task<ActionResult> UpdateStatusAsync(int code)
    {
        try
        {
            var vvn = await vvnRepository.GetByCodeAsync(code);
            if (vvn is null)
                return NotFound($"VVN with code {code} not found");
        
            if (vvn.Status != VVNStatus.Approved && vvn.Status != VVNStatus.Planned)
                return BadRequest("Only Approved and Planned VVNs can use this endpoint");

            if (vvn.Status.Equals(VVNStatus.Planned))
            {
                vvn.Status = VVNStatus.Approved;
            }else if (vvn.Status.Equals(VVNStatus.Approved))
            {
                vvn.Status = VVNStatus.Planned;
            }
            await vvnRepository.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating VVN status");
            return BadRequest(ex.Message);
        }
    }
    
    [HttpGet("not-planned")]
    public async Task<ActionResult<List<VVNDto>>> GetAllNotPlannedAsync()
    {

        var vvns = await vvnRepository.GetAllAsync();
        var approved= vvns.Where(vn => vn.Status.Equals(VVNStatus.Approved)).ToList();
        var vvnsDto = mapper.Map<List<VVNDto>>(approved);
        return Ok(vvnsDto);
    }
}