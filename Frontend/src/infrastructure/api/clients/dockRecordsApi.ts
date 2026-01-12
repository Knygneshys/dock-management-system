import type { DockRecordSearchQuery } from "../../../application/dock-record/queries/DockRecordSearchQuery";
import type { DockRecord } from "../../../domain/Types/entities/DockRecord";
import type { DockRecordCreateDto } from "../../dtos/dock-record/DockRecordCreateDto";
import type { DockRecordUpdateDto } from "../../dtos/dock-record/DockRecordUpdateDto";
import { dockRecordUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllDockRecords = async () => {
  try {
    const data = await apiClient.get(dockRecordUris.GET_ALL);

    return data.data as DockRecord[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createDockRecord = async (dockRecord: DockRecordCreateDto) => {
  const response = await apiClient.post(dockRecordUris.CREATE, dockRecord);
  return response.data as string;
};

export const getDockRecordById = async (dockRecordCode: string) => {
  try {
    const uri = `${dockRecordUris.GET_BY_ID}/${dockRecordCode}`;
    const data = await apiClient.get(uri);

    const dockRecord = data.data as DockRecord;

    return dockRecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateDockRecord = async (
  dockRecordCode: string,
  updatedDockRecord: DockRecordUpdateDto
) => {
  try {
    const uri = `${dockRecordUris.UPDATE}/${dockRecordCode}`;
    const data = await apiClient.put(uri, updatedDockRecord);

    const dockRecord = data.data;

    return dockRecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchDockRecords = async (
  searchQuery: DockRecordSearchQuery | null
) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.append("name", searchQuery.name);
      params.append("location", searchQuery.location);
      params.append("vesselType", searchQuery.vesselType);
      params.append("filterOperator", `${searchQuery.filterOperator}`);

      const uri = `${dockRecordUris.SEARCH}?${params.toString()}`;

      const data = await apiClient.get(uri);

      const dockRecords = data.data;

      return dockRecords as DockRecord[];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
