import type { IStockItemRepository } from "../../domain/interfaces/IStockItemRepository";
import type { StockItem } from "../../domain/Types/entities/StockItem";
import { getAllStockItems } from "../api/clients/stockItemsApi";

export const ExternalApiStockItemRepository: IStockItemRepository = {
  getAll: async function (): Promise<StockItem[]> {
    return await getAllStockItems();
  },
};
