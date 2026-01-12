import { PlannedOperation } from '../../../domain/entities/PlannedOperation';
import { AlgorithmTypes } from '../../../domain/enums/algorithmTypes';

export type CreateOperationPlanCommand = {
  vvnCode: number;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: AlgorithmTypes;
  creatorUserEmail: string;
  plannedOperations: PlannedOperation[];
  isRegenerated?: boolean;
};
