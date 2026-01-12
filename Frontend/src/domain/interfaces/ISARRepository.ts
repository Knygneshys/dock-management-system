import type { CreateSARCommand } from "../../application/shipping-agent-rep/commands/CreateSARCommand";
import type { ShippingAgentRepresentative } from "../Types/entities/ShippingAgentRepresentative";
import type { VVN } from "../Types/entities/VVN";

export interface ISARRepository {
  getAll(): Promise<ShippingAgentRepresentative[]>;
  create(command: CreateSARCommand): Promise<string | null>;
  getAllSarsVvns(): Promise<VVN[]>;
}
