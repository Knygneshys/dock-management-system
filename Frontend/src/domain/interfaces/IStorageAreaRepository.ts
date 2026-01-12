import type { CreateStorageAreaCommand } from "../../application/storage-area/commands/CreateStorageAreaCommand";
import type { UpdateStorageAreaCommand } from "../../application/storage-area/commands/UpdateStorageAreaCommand";
import type { StorageAreaSearchQuery } from "../../application/storage-area/queries/storageAreaSearchQuery";
import type { StorageArea } from "../Types/entities/StorageArea";

export interface IStorageAreaRepository {
  getAll(): Promise<StorageArea[] | undefined>;

  create(command: CreateStorageAreaCommand): Promise<string | undefined>;

  getById(code: string): Promise<StorageArea | undefined>;

  update(
    code: string,
    command: UpdateStorageAreaCommand
  ): Promise<StorageArea | undefined>;

  search(
    query: StorageAreaSearchQuery | null
  ): Promise<StorageArea[] | undefined>;
}
