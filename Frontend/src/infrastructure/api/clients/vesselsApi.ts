import axios from "axios";
import { apiClient } from "../apiClient";
import type { VesselCreateDto } from "../../dtos/vessel/vesselCreateDto";
import type { Vessel } from "../../../domain/Types/entities/Vessel";
import type { VesselSearchQuery } from "../../../application/vessel/queries/VesselSearchQuery";
import type { VesselUpdateDto } from "../../dtos/vessel/vesselUpdateDto";
import { vesselUris } from "../api-utils/apiUriUtils";

export const getAllVessels = async () => {
  try {
    const data = await apiClient.get<Vessel[]>(vesselUris.GET_ALL);

    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createVessel = async (vessel: VesselCreateDto) => {
  try {
    const data = await apiClient.post<string>(vesselUris.CREATE, vessel);
    const vesselId = data.data;

    return vesselId;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data || error.message || "Failed to create vessel"
      );
    }
    return null;
  }
};

export const getVesselByImo = async (vesselImo: string) => {
  try {
    const uri = `${vesselUris.GET_BY_IMO}/${vesselImo}`;
    const data = await apiClient.get<Vessel>(uri);

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error("An error occured!");
  }
};

export const updateVessel = async (
  vesselImo: string,
  updatedVessel: VesselUpdateDto
) => {
  try {
    const uri = `${vesselUris.UPDATE}/${vesselImo}`;
    const data = await apiClient.put<Vessel>(uri, updatedVessel);

    return data.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data || error.message || "Failed to updated Vessel!"
      );
    }

    return null;
  }
};

export const searchVessels = async (searchQuery: VesselSearchQuery | null) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.append("imo", searchQuery.imo);
      params.append("name", searchQuery.name);
      params.append("operatorCode", searchQuery.operatorCode);
      params.append("filterOperator", `${searchQuery.filterOperator}`);

      const uri = `${vesselUris.SEARCH}?${params.toString()}`;

      const data = await apiClient.get<Vessel[]>(uri);

      return data.data;
    }

    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
