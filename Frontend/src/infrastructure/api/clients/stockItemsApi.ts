import type { StockItem } from "../../../domain/Types/entities/StockItem";
import { stockItemsUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllStockItems = async () => {
  const response = await apiClient.get<StockItem[]>(stockItemsUris.getAll);

  return response.data;
};
