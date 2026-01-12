using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs;
using JadeWesserPort.DTOs.UserDTOs;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace JadeWesserPort.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController(
    IUserRepository userRepository,
    IMapper mapper,
    IUserService userService,
    IAuthService authService,
    ILogger<UsersController> logger,
    IDataRectificationRequestRepository dataRectificationRequestRepository) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Guid>> CreateAsync([FromBody] UserDTO userDto)
    {
        var user = mapper.Map<User>(userDto);
        user.Id = Guid.NewGuid();
        var id = await userRepository.CreateAsync(user);
        
        return Ok(id);
    }
    
    [Authorize]
    [HttpPost("assign-role")]
    public async Task<IActionResult> AssignRole([FromBody] AssignUserRoleDto dto)
    {
        await userService.AssignRoleAsync(dto);
        return Ok("Role assigned. Activation email sent if first assignment.");
    }


    [AllowAnonymous]
    [HttpGet("validate-token")]
    public async Task<IActionResult> ValidateToken([FromQuery] string token)
    {
        var result = await userService.ValidateActivationTokenAsync(token);

        if (!result.Valid)
            return BadRequest(new { valid = false, message = result.Message });

        return Ok(new
        {
            valid = true,
            email = result.Email,
            message = result.Message
        });
    }

    [Authorize]
    [HttpPost("complete-activation")]
    public async Task<IActionResult> CompleteActivation([FromBody] CompleteActivationDto dto)
    {
        var result = await userService.CompleteActivationAsync(dto.ActivationToken, User);

        if (!result.Success)
            return Unauthorized(result.ErrorMessage);

        return Ok(new { role = result.Role });
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDTO>> GetCurrentUserAsync()
    {
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }

        var userEmail = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
        var user = await userRepository.GetByEmailAsync(userEmail);
        if (user is null)
            return NotFound("User not found.");

        var dto = mapper.Map<UserDTO>(user);
        return Ok(dto);
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<User>>> GetAllAsync()
    {
        var users = await userRepository.GetAllAsync();
        var userDTOs = mapper.Map<List<User>>(users);
        return Ok(userDTOs);
    }

    [Authorize]
    [HttpGet("role")]
    public async Task<ActionResult<UserRole>> GetRoleByEmailAsync([FromQuery] string email)
    {
        var user = await userRepository.GetByEmailAsync(email);

        if (user is null)
        {
            return NotFound();
        }

        return user.Role;
    }

    [Authorize]
    [HttpPut("approve-privacy-policy")]
    public async Task<ActionResult> ApprovePrivacyPolicy([FromQuery] string email)
    {       
        var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (auth0Id is null)
        {
            logger.LogWarning("Unauthorized access detected!");
            return Unauthorized();
        }

        var userEmail = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
        var user = await userRepository.GetByEmailAsync(userEmail);
        if (user is null)
            return NotFound("User not found.");
        
        await userService.ApprovePrivacyPolicy(email);

        return Ok();
    }

        [Authorize]
        [HttpGet("me/data")]
        public async Task<ActionResult<UserDTO>> GetMyData()
        {
            var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (auth0Id is null)
                return Unauthorized();
            var userEmail = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            var user = await userRepository.GetByEmailAsync(userEmail);
            if (user is null)
                return NotFound("User not found.");
            var dto = mapper.Map<UserDTO>(user);
            return Ok(dto);
        }

        [Authorize]
        [HttpPost("me/data-rectification")]
        public async Task<ActionResult> RequestDataRectification([FromBody] Dictionary<string, object?> fieldsToRectify)
        {
            var auth0Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (auth0Id is null)
                return Unauthorized();
            var userEmail = await authService.GetUserEmailByAuth0IdAsync(auth0Id);
            var user = await userRepository.GetByEmailAsync(userEmail);
            if (user is null)
                return NotFound("User not found.");

            string? justification = null;
            if (fieldsToRectify.TryGetValue("justification", out var justificationObj) && justificationObj is not null)
            {
                justification = justificationObj.ToString();
                fieldsToRectify.Remove("justification");
            }

            var request = new DataRectificationRequest
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Email = user.Email,
                RequestedAt = DateTime.UtcNow,
                Status = "Pending",
                Justification = justification,
                RequestedFields = System.Text.Json.JsonSerializer.Serialize(fieldsToRectify)
            };
            await dataRectificationRequestRepository.CreateAsync(request);

            return Ok("Rectification request registered and will be reviewed by an administrator.");
        }

}