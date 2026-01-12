import type { ISARRepository } from "../../../domain/interfaces/ISARRepository";

export function GetAllSars(sarRepo : ISARRepository) {
    return async () => await sarRepo.getAll();
}