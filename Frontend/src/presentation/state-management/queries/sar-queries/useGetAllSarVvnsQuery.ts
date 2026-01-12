import { useQuery } from "@tanstack/react-query";
import { getAllSARVVNsQueryKey } from "../../query-keys/sarVvnQueryKeys";
import { GetAllSarVVNsUseCase } from "../../../../application/shipping-agent-rep/SARDpendencyInjection";

export const useGetAllSarVvnsQuery = (email: string | undefined) => {
  return useQuery({
    queryKey: [...getAllSARVVNsQueryKey, email],
    queryFn: () => GetAllSarVVNsUseCase()
  });
};
