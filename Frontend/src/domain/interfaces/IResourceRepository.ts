import type { ResourceSearchQuery } from "../../application/resource/queries/resourceSearchQuery";
import type { ResourceCreateDto } from "../../infrastructure/dtos/resource/resourceCreateDto";
import type { Resource } from "../Types/entities/Resource";

export interface IResourceRepository {
  getAll(): Promise<Resource[]>;
  create(craeteDTO: ResourceCreateDto): Promise<string | undefined>;
  search(searchQuery: ResourceSearchQuery | ""): Promise<Resource[]>;
  getByCode(resourceCode: string): Promise<Resource | undefined>;
  reactivate(resourceCode: string): Promise<boolean>;
  deactivate(resourceCode: string): Promise<boolean>;
}
