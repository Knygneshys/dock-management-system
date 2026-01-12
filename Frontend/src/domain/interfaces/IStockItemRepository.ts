import type { StockItem } from "../Types/entities/StockItem";

export interface IStockItemRepository {
  getAll(): Promise<StockItem[]>;
}
