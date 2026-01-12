import type { VesselType } from "../../../domain/Types/entities/VesselType";
import type { VesselTypeSearchQuery } from "../../../application/vessel-type/queries/VesselTypeSearchQuery";
import type { VesselTypeCreateDto } from "../../dtos/vessel-type/VesselTypeCreateDto";
import type { VesselTypeUpdateDto } from "../../dtos/vessel-type/VesselTypeUpdateDto";
import { apiClient } from "../apiClient";
import { vesselTypeUris } from "../api-utils/apiUriUtils";

export const getAllVesselTypes = async () => {
  try {
    const data = await apiClient.get<VesselType[]>(vesselTypeUris.GET_ALL);

    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createVesselType = async (
  vesselTypeCreateDto: VesselTypeCreateDto,
) => {
  try {
    const data = await apiClient.post(
      vesselTypeUris.CREATE,
      vesselTypeCreateDto,
    );
    const vesselTypeId = data.data as string;

    return vesselTypeId;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getVesselTypeById = async (vesselTypeCode: string) => {
  try {
    const uri = `${vesselTypeUris.GET_BY_ID}/${vesselTypeCode}`;
    const data = await apiClient.get<VesselType>(uri);

    const vesselType = data.data;

    return vesselType;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateVesselType = async (
  vesselTypeCode: string,
  updatedVesselType: VesselTypeUpdateDto,
) => {
  try {
    const uri = `${vesselTypeUris.UPDATE}/${vesselTypeCode}`;
    const data = await apiClient.put<VesselType>(uri, updatedVesselType);

    const vesselType = data.data;

    return vesselType;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const searchVesselTypes = async (
  searchQuery: VesselTypeSearchQuery | null,
) => {
  try {
    if (searchQuery !== null) {
      const params = new URLSearchParams();
      params.append("name", searchQuery.name);
      params.append("description", searchQuery.description);
      params.append("filterOperator", `${searchQuery.filterOperator}`);

      const uri = `${vesselTypeUris.SEARCH}?${params.toString()}`;

      const data = await apiClient.get<VesselType[]>(uri);

      const vesselTypes = data.data;

      return vesselTypes;
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
