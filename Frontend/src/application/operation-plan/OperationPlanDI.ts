import { ExternalApiOperationPlanRepository } from "../../infrastructure/repositories/ExternalApiOperationPlanRepository";
import { GetOperationPlanByCode } from "./use-cases/GetOperationPlanByCode";
import { SearchOperationPlans } from "./use-cases/SearchOperationPlans";
import { UpdateOperationPlan } from "./use-cases/UpdateOperationPlan";

export const SearchOperationPlansUseCase = SearchOperationPlans(
  ExternalApiOperationPlanRepository,
);

export const GetOperationPlanByCodeUseCase = GetOperationPlanByCode(
  ExternalApiOperationPlanRepository,
);

export const UpdateOperationPlanUseCase = UpdateOperationPlan(
  ExternalApiOperationPlanRepository,
);
