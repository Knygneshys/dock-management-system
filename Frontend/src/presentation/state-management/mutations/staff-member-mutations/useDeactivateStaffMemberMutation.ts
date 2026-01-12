import { useMutation } from "@tanstack/react-query";

import { successfullDeactivationMessage } from "../../../utils/toastMessageUtils";
import { DeactivateStaffUseCase } from "../../../../application/staff/StaffDependencyInjection";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";

export const useDeactivateStaffMemberMutation = () => {

  return useMutation({
    mutationFn: async (mNumber: number) => {
  return await DeactivateStaffUseCase(mNumber);
  },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullDeactivationMessage("Staff Member")
    }
  });
};
