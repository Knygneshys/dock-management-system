import type { IVesselRepostory } from "../../../domain/interfaces/IVesselRepository";

export function GetAllVessels(vesselRepository : IVesselRepostory) {
    return async () => await vesselRepository.getAll();
}