import type { DockRecordCommand } from "../../application/dock-record/commands/DockRecordCommand";
import type { DockRecordSearchQuery } from "../../application/dock-record/queries/DockRecordSearchQuery";
import type { DockRecord } from "../Types/entities/DockRecord";

export interface IDockRecordRepository {
  getAll(): Promise<DockRecord[] | undefined>;

  create(command: DockRecordCommand): Promise<string | undefined>;

  update(
    code: string,
    command: DockRecordCommand
  ): Promise<DockRecord | undefined>;

  getById(code: string): Promise<DockRecord | undefined>;

  search(
    query: DockRecordSearchQuery | null
  ): Promise<DockRecord[] | undefined>;
}
