import { useMutation } from "@tanstack/react-query";

import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import type { UpdateQualificationCommand } from "../../../../application/qualification/commands/UpdateQualificationCommand";
import { getAllQualificationsQueryKey } from "../../query-keys/qualificationQueryKeys";
import { UpdateQualificationUseCase } from "../../../../application/qualification/QualificationDependencyInjection";

export const useUpdateQualificationMutation = (qualificationCode : string) => {
  return useMutation({
  mutationFn: async (qualification : UpdateQualificationCommand) => {
     return UpdateQualificationUseCase(qualificationCode, qualification);
  },
  meta: {
    invalidatesQuery: getAllQualificationsQueryKey,
    successMessage: successfullUpdateMessage("Qualification")
  }
});
};