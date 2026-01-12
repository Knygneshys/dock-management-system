import { useQuery } from "@tanstack/react-query";
import type { ResourceSearchQuery } from "../../../../application/resource/queries/resourceSearchQuery";
import { warningToast } from "../../../shared/Toaster/Toaster";
import { getAllResourcesQueryKey } from "../../query-keys/resourceQueryKeys";
import { SearchResourcesUseCase } from "../../../../application/resource/ResourceDI";

export const useGetAllResourcesQuery = (searchQuery: ResourceSearchQuery | "") => {
  return useQuery({
    queryKey: [getAllResourcesQueryKey, searchQuery],
    queryFn: async () => {
      try {
        const data = await SearchResourcesUseCase(searchQuery);

        return data;
      } catch {
        warningToast("No results!");
        return [];
      }
    },
    enabled: searchQuery !== null
  });
};
