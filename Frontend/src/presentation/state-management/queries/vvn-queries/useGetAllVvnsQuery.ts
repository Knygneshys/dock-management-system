import { useQuery } from "@tanstack/react-query";
import { getAllVVNsQueryKey } from "../../query-keys/vvnQueryKeys";
import { GetAllVVNsUseCase } from "../../../../application/vvn/VVNDI";

export const useGetAllVvnsQuery = () => {
  return useQuery({
    queryKey: [getAllVVNsQueryKey],
    queryFn: GetAllVVNsUseCase
  });
};
