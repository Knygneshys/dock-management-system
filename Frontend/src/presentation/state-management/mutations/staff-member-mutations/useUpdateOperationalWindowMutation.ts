import { useMutation } from "@tanstack/react-query";

import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import type { OWCommand } from "../../../../application/operational-window/commands/OWCommand";
import { updateOperationalWindow } from "../../../../infrastructure/api/clients/staffMemberApi";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";


export const useUpdateOperationalWindowMutation = () => {
  return useMutation({
    mutationFn: async ({ mecanographicNumber, operationalWindowCode,
        command }:{
          mecanographicNumber: number,
          operationalWindowCode: string,
          command: OWCommand
        }) => {
      return await updateOperationalWindow(mecanographicNumber,
        operationalWindowCode, command);
    },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullUpdateMessage("Operational Window")
    }
  });
};