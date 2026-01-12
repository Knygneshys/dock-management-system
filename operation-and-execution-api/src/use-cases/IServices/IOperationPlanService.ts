import { OperationPlan } from '../../domain/entities/OperationPlan';
import { Result } from '../../shared/logic/Result';
import { CreateOperationPlanCommand } from '../commands/operation-plan-commands/CreateOperationPlanCommand';
import { UpdateOperationPlanCommand } from '../commands/operation-plan-commands/UpdateOperationPlanCommand';
import { SearchOperationPlansQuery } from '../../interface/dtos/operation-plan/SearchOperationPlansQuery';

export default interface IOperationPlanService {
  createOperationPlan(command: CreateOperationPlanCommand): Promise<Result<string>>;

  updateOperationPlan(
    vvnCode: number,
    command: UpdateOperationPlanCommand,
  ): Promise<Result<OperationPlan> | Result<string>>;

  getAll(): Promise<Result<OperationPlan[]>>;

  search(query: SearchOperationPlansQuery): Promise<Result<OperationPlan[]>>;

  deleteByDate(date: Date): Promise<Result<void>>;

  getByCode(vvnCode: number): Promise<Result<OperationPlan> | Result<string>>;
}
