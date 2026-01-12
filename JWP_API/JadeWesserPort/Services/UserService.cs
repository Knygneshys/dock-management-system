using System.Security.Claims;
using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.System;
using JadeWesserPort.DTOs.UserDTOs;
using JadeWesserPort.Services.Interfaces;
using Microsoft.Extensions.Logging;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IEmailService _emailService;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository repository,
        IEmailService emailService,
        ILogger<UserService> logger)
    {
        _repository = repository;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task AssignRoleAsync(AssignUserRoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new ArgumentException("Email is required.");

        var email = dto.Email.Trim();
        var user = await _repository.GetByEmailAsync(email);
        var isNewUser = user is null;

        UserRole previousRole = UserRole.None;

        if (isNewUser)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                Role = dto.Role,
                IsActive = false,
                Auth0Id = null,
            };
        }
        else
        {
            previousRole = user.Role;
            user.Role = dto.Role;
        }

        var isFirstAuthorization = isNewUser || previousRole == UserRole.None;

        if (isFirstAuthorization)
        {
            user.IsActive = false;
            user.ActivationToken = Guid.NewGuid().ToString("N");
            user.ActivationExpiry = DateTime.UtcNow.AddHours(24);

            try
            {
                await _emailService.SendActivationEmailAsync(
                    user.Email,
                    user.ActivationToken,
                    user.Role.ToString()
                );

                _logger.LogInformation(
                    "Activation email sent to {Email} for role {Role}",
                    user.Email,
                    user.Role
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to send activation email to {Email}",
                    user.Email
                );
            }
        }

        if (isNewUser)
        {
            await _repository.CreateAsync(user);
        }
        else
        {
            await _repository.UpdateAsync(user);
        }
    }

    public async Task<ValidateActivationResultDto> ValidateActivationTokenAsync(string token)
    {
        _logger.LogInformation("[Activation] Validating token {Token}", token);

        if (string.IsNullOrWhiteSpace(token))
            return new ValidateActivationResultDto(false, "Invalid or missing activation link.", null);

        var user = await _repository.GetByActivationTokenAsync(token);

        if (user is null || user.ActivationExpiry < DateTime.UtcNow)
            return new ValidateActivationResultDto(false, "Invalid or expired activation link.", null);

        return new ValidateActivationResultDto(
            true,
            "Token is valid. Please complete signup.",
            user.Email
        );
    }

    public async Task<CompleteActivationResultDto> CompleteActivationAsync(
        string activationToken,
        ClaimsPrincipal userPrincipal)
    {
        _logger.LogInformation("[Activation] Completing activation with token {Token}", activationToken);

        if (string.IsNullOrWhiteSpace(activationToken))
            return new CompleteActivationResultDto(false, "Invalid authentication token.", null);

        var user = await _repository.GetByActivationTokenAsync(activationToken);

        if (user is null)
            return new CompleteActivationResultDto(false, "Invalid authentication token.", null);

        if (user.ActivationExpiry < DateTime.UtcNow)
            return new CompleteActivationResultDto(false, "Activation token has expired.", null);

        var auth0Id = userPrincipal.FindFirst("sub")?.Value
                      ?? userPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? userPrincipal.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")
                          ?.Value;

        var emailFromToken = userPrincipal.FindFirst("email")?.Value
                             ?? userPrincipal.FindFirst(ClaimTypes.Email)?.Value
                             ?? userPrincipal
                                 .FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")
                                 ?.Value;

        _logger.LogInformation(
            "[Activation] All claims: {Claims}",
            string.Join(", ", userPrincipal.Claims.Select(c => $"{c.Type}={c.Value}"))
        );

        _logger.LogInformation(
            "[Activation] Completing for DB email {DbEmail}, auth0 sub {Auth0Id}, jwt email {JwtEmail}",
            user.Email,
            auth0Id,
            emailFromToken
        );

        if (string.IsNullOrWhiteSpace(auth0Id))
        {
            _logger.LogError("[Activation] Could not find Auth0 ID in token claims");
            return new CompleteActivationResultDto(false, "Authentication token is missing user identifier.", null);
        }

        if (user.Auth0Id == null)
        {
            user.Auth0Id = auth0Id;
        }
        else if (user.Auth0Id != auth0Id)
        {
            return new CompleteActivationResultDto(false, "Invalid authentication token.", null);
        }

        user.IsActive = true;
        user.ActivationToken = null;
        user.ActivationExpiry = null;

        await _repository.UpdateAsync(user);

        return new CompleteActivationResultDto(true, null, user.Role.ToString());
    }

    public async Task NotifyUsersAboutChangeInPrivacyPolicy()
    {
        await _repository.SetHasReadPrivacyPolicyFlagsToFalse();
    }

    public async Task ApprovePrivacyPolicy(string email)
    {
        await _repository.SetUserPrivacyPolicyFlagToTrue(email);
    }
}
