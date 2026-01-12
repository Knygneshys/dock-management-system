import { VVEStatus } from '../../domain/enums/vveStatus';
import { IExecutedOperationPersistence } from './IExecutedOperationPersistence';

export interface IVVEPersistence {
  _id?: string;
  code: number;
  vvnCode: number;
  vesselImo: string;
  arrivalTime: Date;
  creatorUserEmail: string;
  status: VVEStatus;
  dockCode: string;
  notes?: string[];
  executedOperations: IExecutedOperationPersistence[];
  updatedAt?: Date;
}
