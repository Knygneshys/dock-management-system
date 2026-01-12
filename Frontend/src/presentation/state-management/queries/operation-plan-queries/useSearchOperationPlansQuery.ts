import { useQuery } from "@tanstack/react-query";
import { OperationPlanSearchQuery } from "../../../../application/operation-plan/queries/OperationPlanSearchQuery";
import { searchOperationPlansQueryKey } from "../../query-keys/operationPlanQueryKeys";
import { warningToast } from "../../../shared/Toaster/Toaster";
import { SearchOperationPlansUseCase } from "../../../../application/operation-plan/OperationPlanDI";

export const useSearchOperationPlansQuery = (
  query: OperationPlanSearchQuery,
) => {
  return useQuery({
    queryKey: [...searchOperationPlansQueryKey, query],
    queryFn: async () => {
      try {
        const data = await SearchOperationPlansUseCase(query);

        return data;
      } catch {
        warningToast("No results!");
        return [];
      }
    },
    enabled: query !== null,
  });
};
