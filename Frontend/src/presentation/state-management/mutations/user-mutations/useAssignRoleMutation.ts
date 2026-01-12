import { useMutation } from "@tanstack/react-query";

import { successfullRoleMessage } from "../../../utils/toastMessageUtils";
import type { UserAssignRoleDto } from "../../../../infrastructure/dtos/user/userAssignRoleDto";
import { getUserRoleQueryKey } from "../../query-keys/userQueryKeys";
import { AssignUserRoleUsecase } from "../../../../application/user/UserDI";

export const useAssignRoleMutation = () => {
  return useMutation({
    mutationFn: (dto: UserAssignRoleDto) => AssignUserRoleUsecase(dto),
    meta: {
      invalidatesQuery: getUserRoleQueryKey,
      successMessage: successfullRoleMessage("Role"),
      errorMessage: "Failed to update role."
    }
  });
};
