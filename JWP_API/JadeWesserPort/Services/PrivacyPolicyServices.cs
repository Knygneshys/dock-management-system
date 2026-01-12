using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;
using JadeWesserPort.Services.Interfaces;

namespace JadeWesserPort.Services;

public class PrivacyPolicyServices(IPrivacyPolicyRepository privacyPolicyRepository, IUserService userService) : IPrivacyPolicyServices
{
    public async Task<int> Publish(PublishPrivacyPolicyCommand command)
    {
            var currentVersion = await privacyPolicyRepository.GetCurrentVersion();
            var privacyPolicy = new PrivacyPolicy()
            {
                Id = Guid.NewGuid(),
                Content = command.Content,
                CreatedAt = DateTime.UtcNow,
                Version = currentVersion + 1
            };

            var version = await privacyPolicyRepository.CreateAsync(privacyPolicy);

            await userService.NotifyUsersAboutChangeInPrivacyPolicy();

            return version;
    }
}