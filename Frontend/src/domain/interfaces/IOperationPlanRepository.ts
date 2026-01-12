import { OperationPlanSearchQuery } from "../../application/operation-plan/queries/OperationPlanSearchQuery";
import { UpdateOperationPlanCommand } from "../../application/operation-plan/commands/UpdateOperationPlanCommand";
import { OperationPlan } from "../Types/entities/OperationPlan";

export interface IOperationPlanRepository {
  deleteByDate: (date: Date) => Promise<void>;

  search(query: OperationPlanSearchQuery): Promise<OperationPlan[]>;

  getByCode(vvnCode: number): Promise<OperationPlan | null>;

  update(
    vvnCode: number,
    command: UpdateOperationPlanCommand,
  ): Promise<OperationPlan | null>;
}
