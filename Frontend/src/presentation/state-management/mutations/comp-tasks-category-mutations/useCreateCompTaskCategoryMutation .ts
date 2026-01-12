import { useMutation } from "@tanstack/react-query";
import { CreateCompTaskCategoryDTO } from "../../../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";
import { CreateCompTaskCategoryUseCase } from "../../../../application/complementary-task-category/CompTaskCategoryDependencyInjection";
import { searchCompTaskCategoriesQueryKey } from "../../query-keys/compTaskCategoryQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const useCreateCompTaskCategoryMutation = () => {
  return useMutation({
    mutationFn: async (dto: CreateCompTaskCategoryDTO) => {
      return await CreateCompTaskCategoryUseCase(dto);
    },
    meta: {
      invalidatesQuery: searchCompTaskCategoriesQueryKey,
      successMessage: successfullCreateMessage("Complementary Task Category")
    }
  });
};
