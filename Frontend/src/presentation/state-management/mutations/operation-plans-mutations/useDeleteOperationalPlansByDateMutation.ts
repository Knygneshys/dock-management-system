import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteOperationPlansByDateUseCase } from "../../../../application/operation-plans/OperationPlanDI";
import { getAllOperationPlansQueryKey } from "../../query-keys/operationPlansQueryKey";

export const useDeleteOperationPlansByDateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: Date) => {
      return await DeleteOperationPlansByDateUseCase(date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getAllOperationPlansQueryKey });
    }
  });
};
