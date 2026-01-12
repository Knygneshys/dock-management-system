import { SearchOperationPlansQuery } from '../../interface/dtos/operation-plan/SearchOperationPlansQuery';
import { Repo } from '../../shared/infra/Repo';
import { OperationPlan } from '../entities/OperationPlan';
import { VVNCode } from '../object-values/vvnCode';

export default interface IOperationPlanRepo extends Repo<OperationPlan> {
  getAll(): Promise<OperationPlan[]>;
  findByCode(vvnCode: number): Promise<OperationPlan | null>;
  getDockCodeByVVNCode(vvnCode: VVNCode): Promise<string | null>;
  search(query: SearchOperationPlansQuery): Promise<OperationPlan[]>;
  deleteByDate(date: Date): Promise<void>;
}
