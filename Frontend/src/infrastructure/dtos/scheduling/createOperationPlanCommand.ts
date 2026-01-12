import { AlgorithType } from "../../../domain/Enums/algorithmTypes";
import type { plannedOperationFormatedDateDto } from "../planned-operation/plannedOperationFormatedDateDto";

export type createOperationPlanCommand = {
  vvnCode: number;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: string;
  end: string;
  usedAlgorithm: AlgorithType;
  creatorUserEmail: string;
  plannedOperations: plannedOperationFormatedDateDto[];
  isRegenerated?: boolean;
};
