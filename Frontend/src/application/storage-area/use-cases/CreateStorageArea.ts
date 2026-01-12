import type { IStorageAreaRepository } from "../../../domain/interfaces/IStorageAreaRepository";
import type { CreateStorageAreaCommand } from "../commands/CreateStorageAreaCommand";

export function CreateStorageArea(stAreaRepository : IStorageAreaRepository) {
    return async (stArea : CreateStorageAreaCommand) => await stAreaRepository.create(stArea);
}