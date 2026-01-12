using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Data.Repositories;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.OperationalWindowDTOs;
using JadeWesserPort.DTOs.ShiftDTOs;
using JadeWesserPort.DTOs.StaffDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StaffMembersController(
    IStaffRepository _staffRepository, 
    IMapper _mapper, 
    IStaffService _staffService,
    IQualificationRepository qualificationRepository,
    IShiftRepository shiftsRepo,
    IAuthService authService,
    ILogger<StaffMembersController> logger) : ControllerBase
{

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<StaffDTO>> CreateAsync([FromBody] StaffCreateDTO staff)
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
            var returned = await _staffService.CreateAsyncService(staff);
            return Ok(returned);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
    [HttpPut("{mNumber:int}")]
    public async Task<IActionResult> UpdateAsync([FromRoute] int mNumber, [FromBody] StaffUpdateDTO dto)
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
            var staff = await _staffRepository.GetByIdAsync(mNumber);

            if (staff is null)
                return NotFound();

            _mapper.Map(dto, staff);
            
            if (dto.QualificationCodes != null)
            {
                staff.Qualifications.Clear();
    
                await _staffRepository.SaveChangesAsync();
    
                var newQualifications = await dto.DTOStringsToQualificationListUpdateAsync(qualificationRepository);
    

                foreach (var qual in newQualifications)
                {
                    staff.Qualifications.Add(qual);
                }
                
            }
            await _staffRepository.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(AuthenticationSchemes = "ApiKey,Bearer")]
    [HttpGet]
    public async Task<ActionResult<List<StaffDTO>>> GetAllAsync()
    {
        if (User.Identity?.AuthenticationType == "ApiKey")
        {
            var staffMembers = await _staffRepository.GetAllAsync();
            var staffDto = _mapper.Map<List<StaffDTO>>(staffMembers);
            return Ok(staffDto);
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

        var allStaffMembers = await _staffRepository.GetAllAsync();
        var allStaffDto = _mapper.Map<List<StaffDTO>>(allStaffMembers);
        return Ok(allStaffDto);
    }

    [Authorize]
    [HttpPut("{mNumber:int}/deactivate")]
    public async Task<IActionResult> DeactivateAsync([FromRoute] int mNumber)
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
            var staff = await _staffRepository.GetByIdAsync(mNumber);

            if (staff is null)
                return NotFound();

            if (!staff.isActive)
                return BadRequest("User already deactivated");

            staff.isActive = false;
            await _staffRepository.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [Authorize]
    [HttpPut("{mNumber:int}/activate")]
    public async Task<IActionResult> ActivateAsync([FromRoute] int mNumber)
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
            var staff = await _staffRepository.GetByIdAsync(mNumber);

            if (staff is null)
                return NotFound();

            if (staff.isActive)
                return BadRequest("User already activated");

            staff.isActive = true;
            await _staffRepository.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpPut("{mNumber:int}/status")]
    public async Task<IActionResult> UpdateStatusAsync([FromRoute] int mNumber, [FromBody] StaffStatus status)
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
            var staff = await _staffRepository.GetByIdAsync(mNumber);

            if (staff is null)
                return NotFound();

            if (staff.Status.Equals(status))
                return BadRequest($"Staff member already {status}");
            staff.Status = status;
            await _staffRepository.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<StaffDTO>>> GetBySearchAsync(
        [FromQuery] string? name, 
        [FromQuery] int? mecanographicNumber,
        [FromQuery] StaffStatus? status, 
        [FromQuery] List<string>? qualificationsCodes, 
        [FromQuery] string? operatorType)
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

        if (operatorType != "contains" && operatorType != "equals" && operatorType is not null)
            return BadRequest();

        var result = await _staffService.GetBySearchAsync(name, mecanographicNumber, status, qualificationsCodes, operatorType);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{mNumber:int}/operational-window")]
    public async Task<IActionResult> CreateOperationalWindowAsync(
        [FromRoute] int mNumber, 
        [FromBody] OperationalWindowFormDTO operationalWindowDto)
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
            await _staffService.AddOperationalWindowAsync(
                mNumber,
                operationalWindowDto.DayOfWeek,
                operationalWindowDto.StartTime,
                operationalWindowDto.EndTime
            );

            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException)
        {
            return BadRequest("Operational Window could not be created because it overlaps an existing one");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{mNumber:int}/operational-window/{operationalWindowCode}")]
    public async Task<IActionResult> UpdateOperationalWindowAsync(
        [FromRoute] int mNumber,
        [FromRoute] string operationalWindowCode,
        [FromBody] OperationalWindowFormDTO operationalWindowDto)
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
            await _staffService.UpdateOperationalWindowAsync(
                mNumber,
                operationalWindowCode,
                operationalWindowDto.DayOfWeek,
                operationalWindowDto.StartTime,
                operationalWindowDto.EndTime
            );

            return Ok();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{mNumber:int}/operational-window/{operationalWindowCode}")]
    public async Task<IActionResult> DeleteOperationalWindowAsync(
        [FromRoute] int mNumber, 
        [FromRoute] string operationalWindowCode)
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
            await _staffService.RemoveOperationalWindowAsync(mNumber, operationalWindowCode);
            return Ok();
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
    [HttpPost("{mNumber:int}/shift")]
    public async Task<ActionResult<ShiftDto>> CreateStaffShiftAsync(
        [FromRoute] int mNumber, 
        [FromBody] ShiftCreateDto dto)
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
            var shiftDto = await _staffService.CreateShiftAsync(mNumber, dto);
            if (shiftDto is not null)
            {
                return Ok(shiftDto);
            }
            return BadRequest("Staff is unable to work that shift");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("{mNumber:int}/shifts")]
    public async Task<ActionResult<IEnumerable<ShiftDto>>> GetStaffShiftsAsync(
    [FromRoute] int mNumber)
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
            var ret = await _staffService.GetStaffShiftsAsync(mNumber);

            return Ok(ret);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpGet("/api/shifts")]
    public async Task<ActionResult<IEnumerable<ShiftDto>>> GetAllShiftsAsync()
    {
        var shifts = await shiftsRepo.GetAllAsync();
        var shiftsDto = _mapper.Map<List<ShiftDto>>(shifts);
        
        return Ok(shiftsDto);
    }
    
}
