import { AlgorithmTypes } from '../../../domain/enums/algorithmTypes';
import { PlannedOperationDto } from '../planned-operation/PlannedOperationDto';

export type OperationPlanResponseDto = {
  vvnCode: number;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: AlgorithmTypes;
  creatorUserEmail: string;
  plannedOperations: PlannedOperationDto[];
  createdAt: string;
};
