import type { IVesselTypeRepository } from "../../../domain/interfaces/IVesselTypeRepository";

export function GetAllVesselTypes(vesselTypeRepository : IVesselTypeRepository){
    return async () => await vesselTypeRepository.getAll();
}