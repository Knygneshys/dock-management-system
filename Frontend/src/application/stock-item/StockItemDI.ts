import { ExternalApiStockItemRepository } from "../../infrastructure/repositories/ExternalApiStockItemRepository";
import { GetAllStockItems } from "./use-cases/GetAllStockItems";

export const GetAllStockItemsUseCase = GetAllStockItems(ExternalApiStockItemRepository);
