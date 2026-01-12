import { PlannedOperation } from '../../domain/entities/PlannedOperation';
import { AlgorithmTypes } from '../../domain/enums/algorithmTypes';
import { UserEmail } from '../../domain/object-values/userEmail';
import { VVNCode } from '../../domain/object-values/vvnCode';

export type OperationPlanDto = {
  vvnCode: VVNCode;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: AlgorithmTypes;
  creatorUserEmail: UserEmail;
  plannedOperations: PlannedOperation[];
};
