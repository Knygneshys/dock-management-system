import type { IVesselTypeRepository } from "../../domain/interfaces/IVesselTypeRepository";
import type { VesselType } from "../../domain/Types/entities/VesselType";
import {
  createVesselType,
  getAllVesselTypes,
  getVesselTypeById,
  searchVesselTypes,
  updateVesselType,
} from "../api/clients/vesselTypesApi";
import type { VesselTypeSearchQuery } from "../../application/vessel-type/queries/VesselTypeSearchQuery";
import { mapVesselTypeToVesselTypeUpdateDto } from "../mappers/vesselTypeMapper";

export const ExternalApiVesselTypeRepository: IVesselTypeRepository = {
  getAll: async function (): Promise<VesselType[]> {
    const vesselTypes = await getAllVesselTypes();

    return vesselTypes;
  },
  create: async function (vesselType: VesselType): Promise<string | null> {
    const vesselTypeCode = await createVesselType(vesselType);

    return vesselTypeCode;
  },
  update: async function (
    code: string,
    vesselTypeModel: VesselType,
  ): Promise<VesselType | null> {
    const vesselTypeUpdateDto =
      mapVesselTypeToVesselTypeUpdateDto(vesselTypeModel);
    const updatedVesselType = await updateVesselType(code, vesselTypeUpdateDto);

    return updatedVesselType;
  },
  getById: async function (code: string): Promise<VesselType | null> {
    const vesselType = await getVesselTypeById(code);

    return vesselType;
  },
  getBySearch: async function (
    searchQuery: VesselTypeSearchQuery,
  ): Promise<VesselType[]> {
    const vesselTypes = await searchVesselTypes(searchQuery);

    return vesselTypes;
  },
};
