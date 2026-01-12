import type { IVesselRepostory } from "../../domain/interfaces/IVesselRepository";
import type { Vessel } from "../../domain/Types/entities/Vessel";
import type { VesselSearchQuery } from "../../application/vessel/queries/VesselSearchQuery";
import {
  createVessel,
  getAllVessels,
  getVesselByImo,
  searchVessels,
  updateVessel,
} from "../api/clients/vesselsApi";
import {
  mapCreateVesselCommandToVesselCreateDto,
  mapUpdateVesselCommandToVesselUpdateDto,
} from "../mappers/vesselMapper";
import type { CreateVesselCommand } from "../../application/vessel/commands/CreateVesselCommand";
import type { UpdateVesselCommand } from "../../application/vessel/commands/UpdateVesselCommand";

export const ExternalApiVesselRepository: IVesselRepostory = {
  getAll: async function (): Promise<Vessel[]> {
    return await getAllVessels();
  },
  create: async function (
    command: CreateVesselCommand
  ): Promise<string | null> {
    const vesselCreateDto = mapCreateVesselCommandToVesselCreateDto(command);

    return await createVessel(vesselCreateDto);
  },
  update: async function (
    code: string,
    command: UpdateVesselCommand
  ): Promise<Vessel | null> {
    const vesselUpdateDto = mapUpdateVesselCommandToVesselUpdateDto(command);

    return await updateVessel(code, vesselUpdateDto);
  },
  getById: async function (code: string): Promise<Vessel | null> {
    return await getVesselByImo(code);
  },
  getBySearch: async function (
    searchQuery: VesselSearchQuery
  ): Promise<Vessel[]> {
    return await searchVessels(searchQuery);
  },
};
