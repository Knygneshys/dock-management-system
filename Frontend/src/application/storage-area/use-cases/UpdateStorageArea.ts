import type { IStorageAreaRepository } from "../../../domain/interfaces/IStorageAreaRepository";
import type { UpdateStorageAreaCommand } from "../commands/UpdateStorageAreaCommand";

export function UpdateStorageArea(stAreaRepository : IStorageAreaRepository) {
    return async (code: string, stArea: UpdateStorageAreaCommand) => await stAreaRepository.update(code, stArea);
}