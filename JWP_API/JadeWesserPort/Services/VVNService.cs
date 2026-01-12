using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.CargoManifestDTOs;
using JadeWesserPort.DTOs.CrewMembeDTOs;
using JadeWesserPort.DTOs.VVNDTOs;
using JadeWesserPort.DTOs.VVNFeedbackDTOs;
using JadeWesserPort.Extensions;
using JadeWesserPort.Services.Interfaces;
using MapsterMapper;

namespace JadeWesserPort.Services;

public class VVNService(
    IVVNRepository vvnRepository,
    IVesselRepository vesselRepository,
    IShippingAgentRepresentativeRepository sarRepository,
    IStockItemsRepository stockItemsRepository,
    IDockAvailabilityService dockAvailabilityService,
    IPortLayoutService portLayoutService,
    IMapper mapper) : IVVNService
{
    public async Task<List<CrewMemberDTO>> AddCrewMembersAsync(int vvnCode, IEnumerable<CrewMemberDTO> crewMemberDTOs)
    {
        var vvn = await vvnRepository.GetByCodeAsync(vvnCode);
        if (vvn == null)
            throw new KeyNotFoundException($"VVN with code {vvnCode} not found!");

        //Return list with already existent crew members
        List<CrewMemberDTO> ret = [];

        foreach (var cm in crewMemberDTOs)
        {
            var existingCrewMember = await vvnRepository.FindCrewMemberByCIDAsync(cm.CitizenshipId);
            if (existingCrewMember is null)
            {
                CrewMember crewMember = new CrewMember();
                mapper.Map(cm, crewMember);
                vvn.CrewManifest.Add(crewMember);
                await vvnRepository.SaveChangesAsync();
            } else
            {
                vvn.CrewManifest.Add(existingCrewMember);
                await vvnRepository.SaveChangesAsync();
                CrewMemberDTO retDto = new CrewMemberDTO();
                mapper.Map(existingCrewMember, retDto);
                ret.Add(retDto);
            }
        }

        return ret;
    }

    public async Task<VesselVisitNotification> CreateBaseVVNAsync(VVNCreateDTO dto, string requesterEmail)
    {
        VesselVisitNotification vvn = new();
        mapper.Map(dto, vvn);
        vvn.Vessel = await dto.DTOVesselImoToVessel(vesselRepository);

        var sar = await sarRepository.GetByEmailAsync(requesterEmail) ?? throw new Exception("Unexpexted error!");

        vvn.ShippingAgentRepresentative = sar;
        vvn.Status = VVNStatus.Submitted;

        return vvn;
    }

    public async Task AddLoadManifestFromDtoToVVNAsync(VesselVisitNotification vvn, LoadCargoManifestDTO loadManifestDto)
    {
        vvn.CargoLoadManifest = await loadManifestDto.CreateLoadManifestFromDTOCodes(stockItemsRepository, mapper);
    }

    public void AddUnloadManifestFromDtoToVVNAsync(VesselVisitNotification vvn, UnloadCargoManifestDTO unloadManifestDto)
    {
        vvn.CargoUnloadManifest = unloadManifestDto.CreateUnloadManifestFromDTO(mapper);
    }

    public async Task<int> PersistVVNAsync(VesselVisitNotification vvn)
    {
        await vvnRepository.CreateAsync(vvn);

        return vvn.Code;
    }

    public async Task<VesselVisitNotification?> GetVvnByCodeOnDate(DateOnly date, int vvnCode)
    {
        var vvnList = await vvnRepository.GetAllAsync();

        return vvnList.FirstOrDefault((vvn) =>
            DateOnly.FromDateTime(vvn.Eta.Date).Equals(date) && vvn.Code.Equals(vvnCode));
    }

    public async Task<VVNDto> AcceptVVNAsync(VesselVisitNotification vvn, VVNFeedbackDTO feedbackDto, string officerId)
    {
        vvn.Dock = await dockAvailabilityService.FindAvailableDockAsync(
                vvn.Vessel.Type.Id,
                vvn.Eta,
                vvn.Etd
            ) ?? throw new Exception("No available dock for this vessel type and time period");

        //Adding new items to stock if vvn unloads
        List<StockItem> stockItems = [];
        if (vvn.CargoUnloadManifest is not null)
        {
            foreach (var cargoItem in vvn.CargoUnloadManifest.CargoItems)
            {
                StorageArea mostEmptyStorageArea = await portLayoutService.GetMostEmptyStorageAreaAsync() ?? throw new Exception("No storage available!");
                StockItem stockItem = new();
                mapper.Map(cargoItem, stockItem);
                stockItem.StorageArea = mostEmptyStorageArea;
                stockItem.AvailableSince = vvn.Eta;
                stockItems.Add(stockItem);
            }
        }

        //Add available until in stock items iff vvn loads
        if (vvn.CargoLoadManifest is not null)
        {
            foreach (var cargoItem in vvn.CargoLoadManifest.CargoItems)
            {
                var stock = await stockItemsRepository.GetByIsoAsync(cargoItem.ContainerISO) ?? throw new KeyNotFoundException($"VVN Cargo Manifest has container {cargoItem.ContainerISO} not in stock!");
                stock.AvailableUntil = vvn.Eta;
            }
        }

        foreach (var stockItem in stockItems)
        {
            await stockItemsRepository.CreateAsync(stockItem);
        }
        //Also ChangesAsync for the modified stock items in Cargo Load
        vvn.Status = VVNStatus.Approved;

        var vvnFeedback = new VVNFeedback();
        mapper.Map(feedbackDto, vvnFeedback);
        vvnFeedback.OfficerId = officerId;
        vvnFeedback.Type = VVNStatus.Approved;
        vvnFeedback.CreatedAt = DateTime.UtcNow;

        vvn.FeedBack = vvnFeedback;

        await vvnRepository.SaveChangesAsync();

        VVNDto dto = new();
        mapper.Map(vvn, dto);

        return dto;
    }
}
