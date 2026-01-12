using JadeWesserPort.Domain.System;

namespace JadeWesserPort.Services.Interfaces;

public interface IAuthService
{
    Task<bool> UserIsAuthorizedByAuth0IdAsync(string auth0Id, UserRole role);
    Task<string> GetUserEmailByAuth0IdAsync(string auth0Id);
}