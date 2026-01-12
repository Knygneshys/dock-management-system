import { useQuery } from "@tanstack/react-query";
import { GetAllVVEsUseCase } from "../../../../application/vve/VVEDependencyInjection";
import { getAllVVEsQueryKey } from "../../query-keys/vveQueryKeys";

export const useGetAllVVEsQuery = () => {
  return useQuery({
    queryKey: getAllVVEsQueryKey,
    queryFn: async () => {
      return await GetAllVVEsUseCase();
    }
  });
};