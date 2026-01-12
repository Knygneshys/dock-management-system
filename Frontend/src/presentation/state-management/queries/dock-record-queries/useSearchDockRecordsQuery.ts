import { useQuery } from "@tanstack/react-query";

import { warningToast } from "../../../shared/Toaster/Toaster";
import type { DockRecordSearchQuery } from "../../../../application/dock-record/queries/DockRecordSearchQuery";
import { searchDockRecordsQueryKey } from "../../query-keys/dockRecordQueryKeys";
import { GetDockRecordBySearchUseCase } from "../../../../application/dock-record/DockRecordDependencyInjection";


export const useSearchDockRecordsQuery = (searchQuery : DockRecordSearchQuery | null) => {
  return useQuery({
    queryFn: async () => {
      const data = await GetDockRecordBySearchUseCase(searchQuery);
      const lengthOfZero = 0;

      if (data !== undefined && data.length === lengthOfZero) {
        warningToast("No results matching the query found!");
      }

      return data;
    },
    queryKey: [searchDockRecordsQueryKey, searchQuery],
    enabled: searchQuery !== null,
  });
};
