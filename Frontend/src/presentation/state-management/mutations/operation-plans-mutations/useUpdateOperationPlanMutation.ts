import { useMutation } from "@tanstack/react-query";
import { UpdateOperationPlanCommand } from "../../../../application/operation-plan/commands/UpdateOperationPlanCommand";
import { UpdateOperationPlanUseCase } from "../../../../application/operation-plan/OperationPlanDI";
import { searchOperationPlansQueryKey } from "../../query-keys/operationPlanQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

export const useUpdateOperationPlanMutation = (vvnCode: number) => {
  return useMutation({
    mutationFn: (command: UpdateOperationPlanCommand) =>
      UpdateOperationPlanUseCase(vvnCode, command),
    meta: {
      invalidatesQuery: searchOperationPlansQueryKey,
      successMessage: successfullUpdateMessage("Operation Plan"),
    },
  });
};
