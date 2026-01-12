import { useQuery } from "@tanstack/react-query";
import { getApprovedVVNsQueryKey } from "../../query-keys/vvnQueryKeys";
import { GetApprovedVVNsUseCase } from "../../../../application/vvn/VVNDI";

export const useGetApprovedVVNsQuery = () => {
  return useQuery({
    queryKey: getApprovedVVNsQueryKey,
    queryFn: async () => {
      return await GetApprovedVVNsUseCase();
    }
  });
};