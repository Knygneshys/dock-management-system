import { ExternalApiOperationPlanRepository } from "../../infrastructure/repositories/ExternalApiOperationPlanRepository";
import { DeleteOperationPlansByDate } from "./use-cases/DeleteOperationPlansByDate";

export const DeleteOperationPlansByDateUseCase = DeleteOperationPlansByDate(ExternalApiOperationPlanRepository);
