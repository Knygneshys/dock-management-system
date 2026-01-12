import { VVESearchQuery } from "../../../application/vve/queries/VVESearchQuery";
import { ExecutedOperation } from "../../../domain/Types/entities/ExecutedOperation";
import type { VVE } from "../../../domain/Types/entities/VVE";
import { vveUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllVVEs = async () => {
  try {
    const data = await apiClient.get(vveUris.GET_ALL);
    return data.data as VVE[];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchVVEs = async (searchQuery: VVESearchQuery | null) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();

      if (searchQuery.start) {
        params.append("start", new Date(searchQuery.start).toISOString());
      }
      if (searchQuery.vesselImo) {
        params.append("vesselImo", searchQuery.vesselImo);
      }
      if (searchQuery.status) {
        params.append("status", searchQuery.status);
      }

      const uri = `${vveUris.SEARCH}?${params.toString()}`;
      const data = await apiClient.get(uri);
      return data.data as VVE[];
    }

    return await getAllVVEs();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getExecutedOperationsByVveCode = async (code: number) => {
  try {
    const result = await apiClient.get<ExecutedOperation[]>(
      vveUris.GET_EXECUTED_OPERATIONS(code),
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addExecutedOperationToVve = async (
  code: number,
  executedOperation: ExecutedOperation,
) => {
  try {
    const result = await apiClient.put<string>(
      vveUris.ADD_EXECUTED_OPERATION(code),
      executedOperation,
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
