import type { IDockRecordRepository } from "../../../domain/interfaces/IDockRecordRepository";
import type { DockRecordSearchQuery } from "../queries/DockRecordSearchQuery";

export function GetDockRecordBySearch(dockRecordRepo : IDockRecordRepository) {
    return async (query: DockRecordSearchQuery | null) => await dockRecordRepo.search(query);
}