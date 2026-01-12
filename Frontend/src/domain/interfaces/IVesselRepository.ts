import type { Vessel } from "../Types/entities/Vessel";
import type { VesselSearchQuery } from "../../application/vessel/queries/VesselSearchQuery";
import type { CreateVesselCommand } from "../../application/vessel/commands/CreateVesselCommand";
import type { UpdateVesselCommand } from "../../application/vessel/commands/UpdateVesselCommand";

export interface IVesselRepostory {
  getAll(): Promise<Vessel[]>;

  create(command: CreateVesselCommand): Promise<string | null>;

  update(code: string, command: UpdateVesselCommand): Promise<Vessel | null>;

  getById(code: string): Promise<Vessel | null>;

  getBySearch(searchQuery: VesselSearchQuery): Promise<Vessel[]>;
}
