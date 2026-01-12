import type { IVesselTypeRepository } from "../../../domain/interfaces/IVesselTypeRepository";

export function GetVesselTypeById(vesselTypeRepository : IVesselTypeRepository) {
    return async (code: string) => await vesselTypeRepository.getById(code);
}