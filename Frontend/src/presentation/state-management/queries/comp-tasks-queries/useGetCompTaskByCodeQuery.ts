import { useQuery } from "@tanstack/react-query";
import { getCompTaskByCodeQueryKey } from "../../query-keys/compTaskQueryKeys";
import { GetCompTaskByCodeUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useGetCompTaskByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: [...getCompTaskByCodeQueryKey, code],
    queryFn: async () => await GetCompTaskByCodeUseCase(code),
    enabled: !!code,
  });
};