import type { IDockRecordRepository } from "../../../domain/interfaces/IDockRecordRepository";

export function GetDockRecordById(dockRecordRepo : IDockRecordRepository) {
    return async (code: string) => await dockRecordRepo.getById(code);
}