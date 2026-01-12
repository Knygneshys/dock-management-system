import type { IDockRecordRepository } from "../../../domain/interfaces/IDockRecordRepository";
import type { DockRecordCommand } from "../commands/DockRecordCommand";

export function UpdateDockRecord(dockRecordRepo : IDockRecordRepository) {
    return async (code: string, command: DockRecordCommand) => await dockRecordRepo.update(code, command);
}