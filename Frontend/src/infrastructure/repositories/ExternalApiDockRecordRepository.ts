import type { DockRecordCommand } from "../../application/dock-record/commands/DockRecordCommand";
import type { DockRecordSearchQuery } from "../../application/dock-record/queries/DockRecordSearchQuery";
import type { IDockRecordRepository } from "../../domain/interfaces/IDockRecordRepository";
import type { DockRecord } from "../../domain/Types/entities/DockRecord";
import {
  createDockRecord,
  getAllDockRecords,
  getDockRecordById,
  searchDockRecords,
  updateDockRecord,
} from "../api/clients/dockRecordsApi";
import { mapDockRecordCommandToDto } from "../mappers/dockRecordMapper";

export const ExternalApiDockRecordRepository: IDockRecordRepository = {
  getAll: async function (): Promise<DockRecord[] | undefined> {
    return await getAllDockRecords();
  },

  create: async function (
    command: DockRecordCommand
  ): Promise<string | undefined> {
    const dto = mapDockRecordCommandToDto(command);

    return await createDockRecord(dto);
  },

  update: async function (
    code: string,
    command: DockRecordCommand
  ): Promise<DockRecord | undefined> {
    const dto = mapDockRecordCommandToDto(command);

    return await updateDockRecord(code, dto);
  },

  getById: async function (code: string): Promise<DockRecord | undefined> {
    return await getDockRecordById(code);
  },

  search: async function (
    query: DockRecordSearchQuery
  ): Promise<DockRecord[] | undefined> {
    return await searchDockRecords(query);
  },
};
