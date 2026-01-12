import type { IVesselRepostory } from "../../../domain/interfaces/IVesselRepository";
import type { CreateVesselCommand } from "../commands/CreateVesselCommand";

export function CreateVessel(vesselRepository : IVesselRepostory) {
    return async (vessel : CreateVesselCommand) => await vesselRepository.create(vessel);
}