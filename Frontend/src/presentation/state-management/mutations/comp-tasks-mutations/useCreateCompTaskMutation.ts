import { useMutation } from "@tanstack/react-query";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import { getAllCompTasksQueryKey } from "../../query-keys/compTaskQueryKeys";
import { CreateCompTaskCommand } from "../../../../application/complementary-task/commands/CreateCompTaskCommand";
import { CreateCompTaskUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useCreateCompTaskMutation = () => {
  return useMutation({
    mutationFn: async (command: CreateCompTaskCommand) => {
      return await CreateCompTaskUseCase(command);
    },
    meta: {
      invalidatesQuery: getAllCompTasksQueryKey,
      successMessage: successfullCreateMessage("Complementary Task")
    }
  });
};