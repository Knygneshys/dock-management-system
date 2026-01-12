import type { IStockItemRepository } from "../../../domain/interfaces/IStockItemRepository";

export function GetAllStockItems(stockItemRepository: IStockItemRepository) {
  return async () => await stockItemRepository.getAll();
}
