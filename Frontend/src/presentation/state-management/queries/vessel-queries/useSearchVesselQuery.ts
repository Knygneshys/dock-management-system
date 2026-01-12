import { useQuery } from "@tanstack/react-query";

import { searchVesselsQueryKey } from "../../query-keys/vesselQueryKeys";
import type { VesselSearchQuery } from "../../../../application/vessel/queries/VesselSearchQuery";
import { warningToast } from "../../../shared/Toaster/Toaster";
import { GetVesselsBySearchUseCase } from "../../../../application/vessel/VesselDependencyInjection";

export const useSearchVesselQuery = (searchQuery : VesselSearchQuery | null) => {
  return useQuery({
    queryFn: async () => {
      if(searchQuery === null) {
        return [];
      }

      const data = await GetVesselsBySearchUseCase(searchQuery);
      const lengthOfZero = 0;

      if (data === undefined || data.length === lengthOfZero) {
        warningToast("No results matching the query found!");
      }

      return data;
    },
    queryKey: [searchVesselsQueryKey, searchQuery],
    enabled: searchQuery !== null,
  });
};
