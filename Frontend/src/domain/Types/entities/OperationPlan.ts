import type { PlannedOperation } from "./PlannedOperation";

export type OperationPlan = {
  vvnCode: number;
  dockCode: string;
  craneCodes: string[];
  staffCodes: string[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: string;
  creatorUserEmail: string;
  plannedOperations: PlannedOperation[];
  createdAt: Date;
};
