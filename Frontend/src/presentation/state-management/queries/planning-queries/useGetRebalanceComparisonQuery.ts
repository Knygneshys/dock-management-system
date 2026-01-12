import { useQuery } from "@tanstack/react-query";
import { getRebalanceComparisonQueryKey } from "../../query-keys/planningQueryKeys";
import { getRebalanceComparison } from "../../../../infrastructure/api/clients/planningApi";

export const useGetRebalanceComparisonQuery = (selectedDate: string | null) => {
  return useQuery({
    queryKey: [...getRebalanceComparisonQueryKey, selectedDate],
    queryFn: () => getRebalanceComparison(selectedDate!),
    enabled: !!selectedDate
  });
};

export default useGetRebalanceComparisonQuery;