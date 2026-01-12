import type { CreateStorageAreaCommand } from "../../application/storage-area/commands/CreateStorageAreaCommand";
import type { UpdateStorageAreaCommand } from "../../application/storage-area/commands/UpdateStorageAreaCommand";
import type { StorageAreaSearchQuery } from "../../application/storage-area/queries/storageAreaSearchQuery";
import type { IStorageAreaRepository } from "../../domain/interfaces/IStorageAreaRepository";
import type { StorageArea } from "../../domain/Types/entities/StorageArea";
import {
  createStorageArea,
  getAllStorageAreas,
  getStorageAreaById,
  searchStorageAreas,
  updateStorageArea,
} from "../api/clients/storageAreasApi";
import {
  mapCreateStAreaCommandToStorageAreaCreationDto,
  mapUpdateStAreaCommandToStorageAreaUpdateDto,
} from "../mappers/storageAreaMapper";

export const ExternalApiStAreaRepository: IStorageAreaRepository = {
  getAll: async function (): Promise<StorageArea[] | undefined> {
    return await getAllStorageAreas();
  },

  create: async function (
    command: CreateStorageAreaCommand
  ): Promise<string | undefined> {
    const dto = mapCreateStAreaCommandToStorageAreaCreationDto(command);

    return await createStorageArea(dto);
  },

  update: async function (
    code: string,
    command: UpdateStorageAreaCommand
  ): Promise<StorageArea | undefined> {
    const dto = mapUpdateStAreaCommandToStorageAreaUpdateDto(command);

    return await updateStorageArea(code, dto);
  },

  getById: async function (code: string): Promise<StorageArea | undefined> {
    return await getStorageAreaById(code);
  },

  search: async function (
    query: StorageAreaSearchQuery
  ): Promise<StorageArea[] | undefined> {
    return await searchStorageAreas(query);
  },
};
