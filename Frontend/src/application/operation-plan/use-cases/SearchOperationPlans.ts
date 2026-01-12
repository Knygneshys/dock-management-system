import { IOperationPlanRepository } from "../../../domain/interfaces/IOperationPlanRepository";
import { OperationPlanSearchQuery } from "../queries/OperationPlanSearchQuery";

export function SearchOperationPlans(operationPlanRepositoy: IOperationPlanRepository) {
  return async (query: OperationPlanSearchQuery) => await operationPlanRepositoy.search(query);
}
