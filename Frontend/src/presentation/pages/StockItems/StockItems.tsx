import { CircularProgress } from "@mui/material";

import { useGetAllStockItemsQuery } from "../../state-management/queries/stock-items-queries/useGetAllStockItemsQuery";
import StockItemsTable from "./StockItemsTable/StockItemsTable";

const StockItems = () => {
  const getAllStockItems = useGetAllStockItemsQuery();
  if (getAllStockItems.isLoading || getAllStockItems.data === undefined) {
    return <CircularProgress />;
  }

  return <StockItemsTable stockItems={getAllStockItems.data} />;
};

export default StockItems;
