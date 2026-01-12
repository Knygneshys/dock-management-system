import type { IStorageAreaRepository } from "../../../domain/interfaces/IStorageAreaRepository";

export function GetAllStorageAreas(stAreaRepository : IStorageAreaRepository) {
    return async () => await stAreaRepository.getAll();
}