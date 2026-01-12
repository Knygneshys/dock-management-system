import { IOperationPlanRepository } from "../../../domain/interfaces/IOperationPlanRepository";
import { UpdateOperationPlanCommand } from "../commands/UpdateOperationPlanCommand";

export function UpdateOperationPlan(
  operationPlanRepository: IOperationPlanRepository,
) {
  return async (vvnCode: number, command: UpdateOperationPlanCommand) =>
    await operationPlanRepository.update(vvnCode, command);
}
