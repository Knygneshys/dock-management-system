import { useMutation } from "@tanstack/react-query";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import { getAllCompTasksQueryKey } from "../../query-keys/compTaskQueryKeys";
import { UpdateCompTaskCommand } from "../../../../application/complementary-task/commands/UpdateCompTaskCommand";
import { UpdateCompTaskUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useUpdateCompTaskMutation = () => {
  return useMutation({
    mutationFn: async ({ command, code }: { code: string; command: UpdateCompTaskCommand }) => {
      return await UpdateCompTaskUseCase(command, code);
    },
    meta: {
      invalidatesQuery: getAllCompTasksQueryKey,
      successMessage: successfullUpdateMessage("Complementary Task")
    }
  });
};