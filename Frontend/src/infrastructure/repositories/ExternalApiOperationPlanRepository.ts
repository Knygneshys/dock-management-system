import { OperationPlanSearchQuery } from "../../application/operation-plan/queries/OperationPlanSearchQuery";
import { IOperationPlanRepository } from "../../domain/interfaces/IOperationPlanRepository";
import { OperationPlan } from "../../domain/Types/entities/OperationPlan";
import {
  getOperationPlanByCode,
  searchOperationPlans,
  updateOperationPlan,
} from "../api/oem-clients/operationPlanApi";
import { deleteOperationPlansByDate } from "../api/clients/operationPlanApi";
import { UpdateOperationPlanCommand } from "../../application/operation-plan/commands/UpdateOperationPlanCommand";

export const ExternalApiOperationPlanRepository: IOperationPlanRepository = {
  search: async function (
    query: OperationPlanSearchQuery,
  ): Promise<OperationPlan[]> {
    return await searchOperationPlans(query);
  },
  deleteByDate: async (date: Date) => {
    return await deleteOperationPlansByDate(date);
  },
  getByCode: async function (vvnCode: number): Promise<OperationPlan | null> {
    return await getOperationPlanByCode(vvnCode);
  },
  update: async function (
    vvnCode: number,
    command: UpdateOperationPlanCommand,
  ): Promise<OperationPlan | null> {
    return await updateOperationPlan(vvnCode, command);
  },
};
