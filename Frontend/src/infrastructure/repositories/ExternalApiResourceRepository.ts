import type { ResourceSearchQuery } from "../../application/resource/queries/resourceSearchQuery";
import type { IResourceRepository } from "../../domain/interfaces/IResourceRepository";
import type { Resource } from "../../domain/Types/entities/Resource";
import {
  createResource,
  deactivateResource,
  getResourceByCode,
  reactivateResource,
  searchResources,
} from "../api/clients/resourcesApi";
import type { ResourceCreateDto } from "../dtos/resource/resourceCreateDto";

export const ExternalApiResourceRepository: IResourceRepository = {
  getAll: async function (): Promise<Resource[]> {
    const resources = await searchResources("");

    return resources;
  },
  create: async function (
    craeteDTO: ResourceCreateDto
  ): Promise<string | undefined> {
    const resourceCode = await createResource(craeteDTO);

    return resourceCode;
  },
  search: async function (
    searchQuery: ResourceSearchQuery | ""
  ): Promise<Resource[]> {
    const resources = await searchResources(searchQuery);

    return resources;
  },
  getByCode: async function (
    resourceCode: string
  ): Promise<Resource | undefined> {
    const resource = await getResourceByCode(resourceCode);

    return resource;
  },
  reactivate: async function (resourceCode: string): Promise<boolean> {
    await reactivateResource(resourceCode);
    return true;
  },
  deactivate: async function (resourceCode: string): Promise<boolean> {
    await deactivateResource(resourceCode);
    return true;
  },
};
