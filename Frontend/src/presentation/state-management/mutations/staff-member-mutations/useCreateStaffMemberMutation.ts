import { useMutation } from "@tanstack/react-query";

import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import type { CreateStaffCommand } from "../../../../application/staff/commands/CreateStaffCommand";
import { CreateStaffUseCase } from "../../../../application/staff/StaffDependencyInjection";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";


export const useCreateStaffMemberMutation = () => {

  return useMutation({
    mutationFn: async (command: CreateStaffCommand) => {
  return await CreateStaffUseCase(command);
  },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullCreateMessage("Staff Member")
    }
  });
};
