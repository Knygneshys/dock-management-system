import type { IResourceRepository } from "../../../domain/interfaces/IResourceRepository";
import type { ResourceCreateDto } from "../../../infrastructure/dtos/resource/resourceCreateDto";

export function CreateResource(resourceRepository: IResourceRepository) {
  return async (resourceCreateDto: ResourceCreateDto) => await resourceRepository.create(resourceCreateDto);
}
