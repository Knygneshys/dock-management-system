using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.System;
using JadeWesserPort.Services.Interfaces;

namespace JadeWesserPort.Services;

public class AuthService(IUserRepository userRepository) : IAuthService
{
    public async Task<bool> UserIsAuthorizedByAuth0IdAsync(string auth0Id, UserRole role)
    {
        User? user = await userRepository.GetByAuth0IdAsync(auth0Id) ?? throw new KeyNotFoundException("User not found!");

        if(user.Role is UserRole.SystemAdmin) return true;
        if (!user.Role.Equals(role)) return false;
        return true;
    }

    public async Task<string> GetUserEmailByAuth0IdAsync(string auth0Id)
    {
        User? user = await userRepository.GetByAuth0IdAsync(auth0Id) ?? throw new KeyNotFoundException("User not found!");

        return user.Email;
    }
}