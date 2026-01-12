import type { IResourceRepository } from "../../../domain/interfaces/IResourceRepository";

export function ReactivateResource(resourceRepository: IResourceRepository) {
  return async (code: string) => await resourceRepository.reactivate(code);
}
