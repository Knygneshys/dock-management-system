import type { IVesselRepostory } from "../../../domain/interfaces/IVesselRepository";

export function GetVesselByImo(vesselRepository : IVesselRepostory) {
    return async (imo : string) => await vesselRepository.getById(imo);
}