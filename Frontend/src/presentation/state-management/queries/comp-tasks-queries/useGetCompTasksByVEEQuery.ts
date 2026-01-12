import { useQuery } from "@tanstack/react-query";
import { getCompTasksByVVEQueryKey } from "../../query-keys/compTaskQueryKeys";
import { GetCompTasksByVVEUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useGetCompTasksByVVEQuery = (vveCode: number) => {
  return useQuery({
    queryKey: [...getCompTasksByVVEQueryKey, vveCode],
    queryFn: async () => await GetCompTasksByVVEUseCase(vveCode),
    enabled: !!vveCode
  });
};