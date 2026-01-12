import { useMutation } from "@tanstack/react-query";

import { successfullDeleteMessage } from "../../../utils/toastMessageUtils";
import { deleteOperationalWindow } from "../../../../infrastructure/api/clients/staffMemberApi";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";


export const useDeleteOperationalWindowMutation = () => {
  return useMutation({
    mutationFn: async ({ mecanographicNumber, operationalWindowCode }:{
      mecanographicNumber: number,
      operationalWindowCode: string
    }) => {
      return await deleteOperationalWindow(mecanographicNumber, operationalWindowCode);
    },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullDeleteMessage("Operational Window")
    }
  });
};