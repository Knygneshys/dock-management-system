using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using JadeWesserPort.DTOs.CrewMembeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JadeWesserPort.DTOs.VVNFeedbackDTOs;

namespace JadeWesserPort.Services.Interfaces;

public interface IVVNService
{
    Task<List<CrewMemberDTO>> AddCrewMembersAsync(int vvnCode, IEnumerable<CrewMemberDTO> crewMemberDTOs);
    Task<VesselVisitNotification> CreateBaseVVNAsync(VVNCreateDTO dto, string requesterEmail);
    Task AddLoadManifestFromDtoToVVNAsync(VesselVisitNotification vvn, LoadCargoManifestDTO loadManifestDto);
    void AddUnloadManifestFromDtoToVVNAsync(VesselVisitNotification vvn, UnloadCargoManifestDTO unloadManifestDto);
    Task<VVNDto> AcceptVVNAsync(VesselVisitNotification vvn, VVNFeedbackDTO feedbackDto, string officerId);
    Task<int> PersistVVNAsync(VesselVisitNotification vvn);

    Task<VesselVisitNotification?> GetVvnByCodeOnDate(DateOnly date, int vvnCode);
}
