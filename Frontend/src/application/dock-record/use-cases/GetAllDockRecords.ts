import type { IDockRecordRepository } from "../../../domain/interfaces/IDockRecordRepository";

export function GetAllDockRecords(dockRecordRepo : IDockRecordRepository) {
    return async () => await dockRecordRepo.getAll();
}