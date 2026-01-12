import type { ISARRepository } from "../../../domain/interfaces/ISARRepository";

export function GetAllSarVVNs(sarRepository: ISARRepository) {
  return async () => await sarRepository.getAllSarsVvns();
}
