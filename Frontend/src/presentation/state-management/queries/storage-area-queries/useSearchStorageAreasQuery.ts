import { useQuery } from "@tanstack/react-query";
import type { StorageAreaSearchQuery } from "../../../../application/storage-area/queries/storageAreaSearchQuery";
import { searchStorageAreasQueryKey } from "../../query-keys/storageAreaQueryKeys";
import { GetStAreaBySearchUseCase } from "../../../../application/storage-area/StAreaDependencyInjection";
import { warningToast } from "../../../shared/Toaster/Toaster";

export const useSearchStorageAreasQuery = (searchQuery: StorageAreaSearchQuery | null) => {
  return useQuery({
    queryFn: async () => {
      const data = await GetStAreaBySearchUseCase(searchQuery);

      if (!data) {
        warningToast("No results matching the query found!");
        return [];
      }

      const lengthOfZero = 0;
      if (data.length === lengthOfZero) {
        warningToast("No results matching the query found!");
      }

      return data;
    },
    queryKey: [searchStorageAreasQueryKey, searchQuery],
    enabled: searchQuery !== null
  });
};
