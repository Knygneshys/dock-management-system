import type { CreateSARCommand } from "../../application/shipping-agent-rep/commands/CreateSARCommand";
import type { ISARRepository } from "../../domain/interfaces/ISARRepository";
import type { ShippingAgentRepresentative } from "../../domain/Types/entities/ShippingAgentRepresentative";
import type { VVN } from "../../domain/Types/entities/VVN";
import { createSar, getAllSARs, getAllSarVvns } from "../api/clients/sarsApi";
import { mapCreateSarCommmandToSarDto } from "../mappers/sarMapper";

export const ExternalApiSARRepository: ISARRepository = {
  getAll: async function (): Promise<ShippingAgentRepresentative[]> {
    return await getAllSARs();
  },

  create: async function (command: CreateSARCommand): Promise<string | null> {
    const dto = mapCreateSarCommmandToSarDto(command);

    return await createSar(dto);
  },

  getAllSarsVvns: async function (): Promise<VVN[]> {
    return await getAllSarVvns();
  },
};
