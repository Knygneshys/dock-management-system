import type { StorageAreaSearchQuery } from "../../../application/storage-area/queries/storageAreaSearchQuery";
import type { StorageArea } from "../../../domain/Types/entities/StorageArea";
import type { StorageAreaCreationDto } from "../../dtos/storage-area/storageAreaCreationDto";
import type { StorageAreaUpdateDto } from "../../dtos/storage-area/storageAreaUpdateDto";
import { storageAreasUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllStorageAreas = async () => {
  try {
    const data = await apiClient.get(storageAreasUris.GET_ALL);

    return data.data as StorageArea[];
  } catch (error) {
    console.log(error);
  }
};

export const createStorageArea = async (
  storageArea: StorageAreaCreationDto
) => {
  try {
    const data = await apiClient.post(storageAreasUris.CREATE, storageArea);
    const storageAreaId = data.data as string;

    return storageAreaId;
  } catch (error) {
    console.log(error);
  }
};

export const getStorageAreaById = async (storageAreaCode: string) => {
  try {
    const uri = `${storageAreasUris.GET_BY_ID}/${storageAreaCode}`;
    const data = await apiClient.get(uri);

    const storageArea = data.data as StorageArea;

    return storageArea;
  } catch (error) {
    console.log(error);
  }
};

export const updateStorageArea = async (
  storageAreaCode: string,
  updatedStorageArea: StorageAreaUpdateDto
) => {
  try {
    const uri = `${storageAreasUris.UPDATE}/${storageAreaCode}`;
    const data = await apiClient.put(uri, updatedStorageArea);

    const storageArea = data.data as StorageArea;

    return storageArea;
  } catch (error) {
    console.log(error);
  }
};

export const searchStorageAreas = async (
  searchQuery: StorageAreaSearchQuery | null
) => {
  try {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.append("type", searchQuery.type);
      params.append("location", searchQuery.location);
      params.append("filterOperator", `${searchQuery.filterOperator}`);

      const uri = `${storageAreasUris.SEARCH}?${params.toString()}`;

      const data = await apiClient.get(uri);

      const storageAreas = data.data;

      return storageAreas;
    }
  } catch (error) {
    console.log(error);
  }
};
