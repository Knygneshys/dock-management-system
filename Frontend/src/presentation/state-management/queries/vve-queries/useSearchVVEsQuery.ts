import { useQuery } from "@tanstack/react-query";
import type { VVESearchQuery } from "../../../../application/vve/queries/VVESearchQuery";
import { searchVVEsQueryKey } from "../../query-keys/vveQueryKeys";
import { SearchVVEsUseCase } from "../../../../application/vve/VVEDependencyInjection";

export const useSearchVVEsQuery = (searchQuery: VVESearchQuery | null) => {
  return useQuery({
    queryKey: [...searchVVEsQueryKey, searchQuery],
    queryFn: async () => {
      if (!searchQuery) {
        return [];
      }
      return await SearchVVEsUseCase(searchQuery);
    },
    enabled: !!searchQuery,
  });
};