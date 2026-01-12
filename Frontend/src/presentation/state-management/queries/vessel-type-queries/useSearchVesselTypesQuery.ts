import { useQuery } from "@tanstack/react-query";

import { searchVesselTypesQueryKey } from "../../query-keys/vesselTypeQueryKeys";
import { warningToast } from "../../../shared/Toaster/Toaster";
import type { VesselTypeSearchQuery } from "../../../../application/vessel-type/queries/VesselTypeSearchQuery";
import { SearchVesselTypesUseCase } from "../../../../application/vessel-type/VesselTypeDependencyInjection";

export const useSearchVesselTypesQuery = (searchQuery : VesselTypeSearchQuery | null) => {
  return useQuery({
    queryFn: async () => {
      if(searchQuery === null)
      {
        return [];
      }

      const data = await SearchVesselTypesUseCase(searchQuery);
      const lengthOfZero = 0;

      if (data.length === lengthOfZero) {
        warningToast("No results matching the query found!");
      }

      return data;
    },
    queryKey: [searchVesselTypesQueryKey, searchQuery],
    enabled: searchQuery !== null,
  });
};
