import { useMutation } from "@tanstack/react-query";

import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import type { CreateQualificationCommand } from "../../../../application/qualification/commands/CreateQualificationCommand";
import { getAllQualificationsQueryKey } from "../../query-keys/qualificationQueryKeys";
import { CreateQualificationUseCase } from "../../../../application/qualification/QualificationDependencyInjection";

export const useCreateQualificationMutation = () => {

  return useMutation({
    mutationFn: async (qualification : CreateQualificationCommand) => {
     return await CreateQualificationUseCase(qualification);
    },
    meta: {
      invalidatesQuery: getAllQualificationsQueryKey,
      successMessage: successfullCreateMessage("Qualification")
    }
  });
};
