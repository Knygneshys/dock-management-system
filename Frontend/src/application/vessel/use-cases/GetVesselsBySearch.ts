import type { IVesselRepostory } from "../../../domain/interfaces/IVesselRepository";
import type { VesselSearchQuery } from "../queries/VesselSearchQuery";

export function GetVesselsBySearch(vesselRepository : IVesselRepostory) {
    return async (searchQuery : VesselSearchQuery) => vesselRepository.getBySearch(searchQuery);
}