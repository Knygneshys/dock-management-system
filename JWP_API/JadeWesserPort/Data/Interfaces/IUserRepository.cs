using JadeWesserPort.Domain.System;

namespace JadeWesserPort.Data.Interfaces
{
    public interface IUserRepository
    {
        Task<Guid> CreateAsync(User user);
        Task<User?> GetByAuth0IdAsync(string auth0Id);
        Task<User?> GetByEmailAsync(string email);
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(Guid id);
        Task UpdateAsync(User user);
        Task<User?> GetByActivationTokenAsync(string token);
        Task SetHasReadPrivacyPolicyFlagsToFalse();
        Task SetUserPrivacyPolicyFlagToTrue(string email);
        Task DeleteAsync(Guid id);
    }
}
