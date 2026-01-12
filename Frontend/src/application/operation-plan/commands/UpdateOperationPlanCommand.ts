import { PlannedOperation } from "../../../domain/Types/entities/PlannedOperation";
import { plannedOperationFormatedDateDto } from "../../../infrastructure/dtos/planned-operation/plannedOperationFormatedDateDto";

export type UpdateOperationPlanCommand = {
  dockCode: string;
  craneCodes: string[];
  staffCodes: string[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: string;
  creatorUserEmail: string;
  plannedOperations: plannedOperationFormatedDateDto[];
};
