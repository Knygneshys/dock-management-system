import { useQuery } from "@tanstack/react-query";
import { getAllSARsQueryKey } from "../../query-keys/sarQueryKeys";
import { getAllSARs } from "../../../../infrastructure/api/clients/sarsApi";



export const useGetAllSarsQuery = () => {
  return useQuery({
    queryKey: getAllSARsQueryKey,
    queryFn: getAllSARs,
  });
};