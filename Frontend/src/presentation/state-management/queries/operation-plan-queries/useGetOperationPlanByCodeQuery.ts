import { useQuery } from "@tanstack/react-query";
import { searchOperationPlansQueryKey } from "../../query-keys/operationPlanQueryKeys";
import { GetOperationPlanByCodeUseCase } from "../../../../application/operation-plan/OperationPlanDI";

export const useGetOperationPlanByCodeQuery = (vvnCode: number) => {
  return useQuery({
    queryKey: [searchOperationPlansQueryKey, vvnCode],
    queryFn: () => GetOperationPlanByCodeUseCase(vvnCode),
  });
};
