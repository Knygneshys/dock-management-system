import type { IVesselTypeRepository } from "../../../domain/interfaces/IVesselTypeRepository";
import type { VesselType } from "../../../domain/Types/entities/VesselType";

export function UpdateVesselType(vesselTypeRepository: IVesselTypeRepository) {
  return async (code: string, vesselTypeModel: VesselType) =>
    await vesselTypeRepository.update(code, vesselTypeModel);
}
