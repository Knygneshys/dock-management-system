using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface IPrivacyPolicyServices
{
    Task<int> Publish(PublishPrivacyPolicyCommand command);
}