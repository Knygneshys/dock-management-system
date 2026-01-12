import type { IStorageAreaRepository } from "../../../domain/interfaces/IStorageAreaRepository";

export function GetStAreaById(stAreaRepository : IStorageAreaRepository) {
    return async (code: string) => await stAreaRepository.getById(code);
}