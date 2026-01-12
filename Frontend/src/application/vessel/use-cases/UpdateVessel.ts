import type { IVesselRepostory } from "../../../domain/interfaces/IVesselRepository";
import type { UpdateVesselCommand } from "../commands/UpdateVesselCommand";

export function UpdateVessel(vesselRepository : IVesselRepostory) {
    return async (code : string, command : UpdateVesselCommand) => await vesselRepository.update(code, command);
}