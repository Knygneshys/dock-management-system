import { useQuery } from "@tanstack/react-query";
import { searchCompTasksQueryKey } from "../../query-keys/compTaskQueryKeys";
import { CompTaskSearchQuery } from "../../../../application/complementary-task/queries/CompTaskSearchQuery";
import { SearchCompTasksUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useSearchCompTasksQuery = (searchQuery: CompTaskSearchQuery | null) => {
  return useQuery({
    queryKey: [...searchCompTasksQueryKey, searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        return [];
      }
      return await SearchCompTasksUseCase(searchQuery);
    },
    enabled: !!searchQuery
  });
};