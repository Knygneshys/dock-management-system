import { useQuery } from "@tanstack/react-query";
import { SearchIncidentQuery } from "../../../../application/incident/queries/SearchIncidentQuery";
import { searchIncidentsQueryKey } from "../../query-keys/incidentQueryKeys";
import { SearchIncidentsUseCase } from "../../../../application/incident/IncidentDI";

export const useSearchIncidents = (query: SearchIncidentQuery) => {
  return useQuery({
    queryKey: [...searchIncidentsQueryKey, query],
    queryFn: async () => {
      return await SearchIncidentsUseCase(query);
    }
  });
};
