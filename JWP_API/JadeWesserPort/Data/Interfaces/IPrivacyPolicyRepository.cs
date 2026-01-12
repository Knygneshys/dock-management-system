using JadeWesserPort.Domain;
using JadeWesserPort.DTOs.DockStorageDistanceDTOs.PrivacyPolicyDTOs;

namespace JadeWesserPort.Data.Interfaces;

public interface IPrivacyPolicyRepository
{
    Task<int> CreateAsync(PrivacyPolicy privacyPolicy);

    Task<List<PrivacyPolicy>> GetAllAsync();

    Task<int> GetCurrentVersion();

    Task<PrivacyPolicy?> GetNewestPolicy();
}