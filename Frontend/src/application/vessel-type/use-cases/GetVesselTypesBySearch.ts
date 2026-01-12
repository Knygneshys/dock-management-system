import type { IVesselTypeRepository } from "../../../domain/interfaces/IVesselTypeRepository";
import type { VesselTypeSearchQuery } from "../queries/VesselTypeSearchQuery";

export function GetVesselTypesBySearch(vesselTypeRepository : IVesselTypeRepository) {
    return async (searchQuery : VesselTypeSearchQuery) => await vesselTypeRepository.getBySearch(searchQuery);
}