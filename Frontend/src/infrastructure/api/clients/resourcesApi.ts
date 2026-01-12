import axios from "axios";
import { resourceUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";
import type { Resource } from "../../../domain/Types/entities/Resource";
import type { ResourceSearchQuery } from "../../../application/resource/queries/resourceSearchQuery";
import type { ResourceCreateDto } from "../../dtos/resource/resourceCreateDto";

export const searchResources = async (
  searchQuery: ResourceSearchQuery | ""
) => {
  if (searchQuery === "") {
    const params = new URLSearchParams();
    const uri = `${resourceUris.search}?${params.toString()}`;
    const response = await apiClient.get<Resource[]>(uri);

    return response.data;
  } else {
    const params = new URLSearchParams();
    if (searchQuery.description !== undefined) {
      params.append("description", searchQuery.description);
    }
    if (searchQuery.type !== undefined) {
      params.append("type", searchQuery.type);
    }
    if (searchQuery.status !== undefined) {
      params.append("status", searchQuery.status);
    }

    const uri = `${resourceUris.search}?${params.toString()}`;

    const response = await apiClient.get<Resource[]>(uri);

    return response.data;
  }
};

export const getResourceByCode = async (resourceCode: string) => {
  try {
    const uri = resourceUris.getByCode(resourceCode);
    const response = await apiClient.get(uri);

    return response.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data || error.message || "Failed to get resource"
      );
    }
  }
};

export const createResource = async (resource: ResourceCreateDto) => {
  try {
    const response = await apiClient.post(resourceUris.create, resource);
    const resourceCode = response.data as string;

    return resourceCode;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data || error.message || "Failed to create resource"
      );
    }
  }
};

export const reactivateResource = async (code: string) => {
  try {
    const response = await apiClient.put(resourceUris.reactivate(code));

    return response;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data ||
          error.message ||
          "Failed to reactivate resource"
      );
    }
  }
};

export const deactivateResource = async (code: string) => {
  try {
    const response = await apiClient.put(resourceUris.deactivate(code));

    return response;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data ||
          error.message ||
          "Failed to deactivate resource"
      );
    }
  }
};
