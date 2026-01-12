import { useMutation } from "@tanstack/react-query";
import { ExecutedOperation } from "../../../../domain/Types/entities/ExecutedOperation";
import { AddExecutedOperationByCodeUseCase } from "../../../../application/vve/VVEDependencyInjection";
import { getExecutedOperationsByVveCodeQueryKey } from "../../query-keys/vveQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const useAddExecutedOperationToVveMutation = (code: number) => {
  return useMutation({
    mutationFn: (executedOperation: ExecutedOperation) => {
      return AddExecutedOperationByCodeUseCase(code, executedOperation);
    },
    meta: {
      invalidatesQuery: [...getExecutedOperationsByVveCodeQueryKey, code],
      successMessage: successfullCreateMessage("Executed Operation"),
    },
  });
};
