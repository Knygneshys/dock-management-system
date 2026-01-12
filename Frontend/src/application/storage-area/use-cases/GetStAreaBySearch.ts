import type { IStorageAreaRepository } from "../../../domain/interfaces/IStorageAreaRepository";
import type { StorageAreaSearchQuery } from "../queries/storageAreaSearchQuery";

export function GetStAreaBySearch(stAreaRepository : IStorageAreaRepository) {
    return async (query : StorageAreaSearchQuery | null) => await stAreaRepository.search(query);
}