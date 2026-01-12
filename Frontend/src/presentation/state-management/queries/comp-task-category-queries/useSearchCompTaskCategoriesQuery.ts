import { useQuery } from "@tanstack/react-query";
import { searchCompTaskCategoriesQueryKey } from "../../query-keys/compTaskCategoryQueryKeys";
import { SearchCompTaskCategoriesUseCase } from "../../../../application/complementary-task-category/CompTaskCategoryDependencyInjection";
import { CompTaskCategorySearchQuery } from "../../../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";

export const useSearchCompTaskCategoriesQuery = (query: CompTaskCategorySearchQuery) => {
  return useQuery({
    queryKey: [...searchCompTaskCategoriesQueryKey, query],
    queryFn: async () => {
      return await SearchCompTaskCategoriesUseCase(query);
    }
  });
};
