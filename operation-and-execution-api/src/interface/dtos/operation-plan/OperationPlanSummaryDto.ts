import { AlgorithmTypes } from '../../../domain/enums/algorithmTypes';

export type OperationPlanSummaryDto = {
  vvnCode: number;
  dockCode: string;
  craneCode: string[];
  staffCode: number[];
  storageAreaCode: string;

  start: string;
  end: string;

  usedAlgorithm: AlgorithmTypes;
  creatorUserEmail: string;

  plannedOperationsCount: number;
  createdAt: string;
};
