import { useQuery } from "@tanstack/react-query";
import { SearchIncidentTypesQuery } from "../../../../application/incident-type/queries/SearchIncidentTypesQuery";
import { SearchIncidentTypesUseCase } from "../../../../application/incident-type/IncidentTypeDependencyInjection";
import { warningToast } from "../../../shared/Toaster/Toaster";
import { searchIncidentTypesQueryKey } from "../../query-keys/incidentTypeQueryKeys";

export const useSearchIncidentTypesQuery = (
  query: SearchIncidentTypesQuery,
) => {
  return useQuery({
    queryFn: async () => {
      try {
        const data = await SearchIncidentTypesUseCase(query);

        return data;
      } catch (error) {
        warningToast("No results!");

        return [];
      }
    },
    queryKey: [...searchIncidentTypesQueryKey, query],
    enabled: query !== null,
  });
};
