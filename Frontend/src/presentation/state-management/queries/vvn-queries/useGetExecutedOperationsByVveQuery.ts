import { useQuery } from "@tanstack/react-query";
import { getExecutedOperationsByVveCodeQueryKey } from "../../query-keys/vveQueryKeys";
import { GetExecutedOperationsByCodeUseCase } from "../../../../application/vve/VVEDependencyInjection";

export const useGetExecutedOperationsByVveQuery = (code: number) => {
  return useQuery({
    queryKey: [...getExecutedOperationsByVveCodeQueryKey, code],
    queryFn: () => GetExecutedOperationsByCodeUseCase(code),
  });
};
