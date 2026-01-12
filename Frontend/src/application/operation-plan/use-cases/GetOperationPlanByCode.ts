import { IOperationPlanRepository } from "../../../domain/interfaces/IOperationPlanRepository";

export function GetOperationPlanByCode(
  operationPlanRepository: IOperationPlanRepository,
) {
  return async (vvnCode: number) =>
    await operationPlanRepository.getByCode(vvnCode);
}
