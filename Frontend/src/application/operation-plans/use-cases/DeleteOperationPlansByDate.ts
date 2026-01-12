import { IOperationPlanRepository } from "../../../domain/interfaces/IOperationPlanRepository";

export const DeleteOperationPlansByDate = (repo: IOperationPlanRepository) => {
  return async (date: Date) => {
    return await repo.deleteByDate(date);
  };
};
