import { useMutation } from "@tanstack/react-query";

import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import type { OWCommand } from "../../../../application/operational-window/commands/OWCommand";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";
import { createOperationalWindow } from "../../../../infrastructure/api/clients/staffMemberApi";


export const useCreateOperationalWindowMutation = () => {

  return useMutation({
    mutationFn: ({mecanographicNumber, 
      command}: {
    mecanographicNumber: number,
      command: OWCommand,
  }) =>
    createOperationalWindow(mecanographicNumber, command),
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullCreateMessage("Operational Window")
    }
});
};
