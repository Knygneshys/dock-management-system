using System.Security.Claims;
using JadeWesserPort.DTOs.UserDTOs;

namespace JadeWesserPort.Services.Interfaces
{
    public interface IUserService
    {
        Task AssignRoleAsync(AssignUserRoleDto dto);
        Task<ValidateActivationResultDto> ValidateActivationTokenAsync(string token);

        Task<CompleteActivationResultDto> CompleteActivationAsync(
            string activationToken,
            ClaimsPrincipal userPrincipal);

        Task NotifyUsersAboutChangeInPrivacyPolicy();

        Task ApprovePrivacyPolicy(string email);
    }
}
