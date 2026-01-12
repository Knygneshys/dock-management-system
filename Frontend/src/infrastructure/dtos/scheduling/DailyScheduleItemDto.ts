import type { PlannedOperation } from "../../../domain/Types/entities/PlannedOperation";

export type DailyScheduleItemDto = {
  vvnCode: number;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: number;
  end: number;
  plannedOperations: PlannedOperation[];
};
