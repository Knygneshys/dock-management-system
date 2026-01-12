import type { IResourceRepository } from "../../../domain/interfaces/IResourceRepository";
import type { ResourceSearchQuery } from "../queries/resourceSearchQuery";

export function SearchResources(resourceRepository: IResourceRepository) {
  return async (searchQuery: ResourceSearchQuery | "") => await resourceRepository.search(searchQuery);
}
