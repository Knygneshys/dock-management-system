import { useMutation } from "@tanstack/react-query";

import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import type { UpdateStaffCommand } from "../../../../application/staff/commands/UpdateStaffCommand";
import { UpdateStaffUseCase } from "../../../../application/staff/StaffDependencyInjection";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";


export const useUpdateStaffMemberMutation = () => {

  return useMutation({
    mutationFn: async ({mecanographicNumber, staffMember}: {
      mecanographicNumber: number, 
      staffMember: UpdateStaffCommand
    }) => {
  return await UpdateStaffUseCase(mecanographicNumber, staffMember);
  },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullUpdateMessage("Staff Member")
    }
  });
};
