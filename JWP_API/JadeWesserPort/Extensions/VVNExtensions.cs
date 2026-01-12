using JadeWesserPort.Data.Interfaces;
using JadeWesserPort.Domain.Entities;
using JadeWesserPort.DTOs.VVNDTOs;

namespace JadeWesserPort.Extensions;

public static class VVNExtensions
{
    public static async Task<Vessel> DTOVesselImoToVessel(this VVNCreateDTO VVNCreateDto, IVesselRepository vesselRepository)
    {
        var vessel = await vesselRepository.GetByImoAsync(VVNCreateDto.VesselImo);

        if (vessel is not null)
        {
            return vessel;
        }
        else
        {
            throw new KeyNotFoundException($"Vessel with imo {VVNCreateDto.VesselImo} does not exist!");
        }
    }
}
