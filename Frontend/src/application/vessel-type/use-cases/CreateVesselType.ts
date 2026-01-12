import type { IVesselTypeRepository } from "../../../domain/interfaces/IVesselTypeRepository";
import type { VesselType } from "../../../domain/Types/entities/VesselType";

export function CreateVesselType(vesselTypeRepository: IVesselTypeRepository) {
  return async (vesselType: VesselType) =>
    await vesselTypeRepository.create(vesselType);
}
