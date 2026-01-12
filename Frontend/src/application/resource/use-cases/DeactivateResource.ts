import type { IResourceRepository } from "../../../domain/interfaces/IResourceRepository";

export function DeactivateResource(resourceRepository: IResourceRepository) {
  return async (code: string) => await resourceRepository.deactivate(code);
}
