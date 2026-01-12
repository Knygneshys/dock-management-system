import { useQuery } from "@tanstack/react-query";
import { GetAllStockItemsUseCase } from "../../../../application/stock-item/StockItemDI";
import { getAllSockItemsQueryKey } from "../../query-keys/stockItemQueryKeys";

export const useGetAllStockItemsQuery = () => {
  return useQuery({
    queryKey: getAllSockItemsQueryKey,
    queryFn: GetAllStockItemsUseCase
  });
};
