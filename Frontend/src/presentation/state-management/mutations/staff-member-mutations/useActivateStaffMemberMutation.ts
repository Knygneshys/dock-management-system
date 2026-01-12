import { useMutation } from "@tanstack/react-query";

import { successfullActivationMessage } from "../../../utils/toastMessageUtils";
import { activateStaffMember } from "../../../../infrastructure/api/clients/staffMemberApi";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";


export const useActivateStaffMemberMutation = () => {

  return useMutation({
    mutationFn: async (mNumber: number) => {
  return await activateStaffMember(mNumber);
  },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullActivationMessage("Staff Member")
    }
  });
};
