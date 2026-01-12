import type { IDockRecordRepository } from "../../../domain/interfaces/IDockRecordRepository";
import type { DockRecordCommand } from "../commands/DockRecordCommand";

export function CreateDockRecord(dockRecordRepo : IDockRecordRepository) {
    return async (command: DockRecordCommand) => await dockRecordRepo.create(command);
}