import { useMutation } from "@tanstack/react-query";

import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";
import { UpdateStaffUseCase } from "../../../../application/staff/StaffDependencyInjection";


export const useUpdateStaffQualificationsMutation = () => {
  return useMutation({
    mutationFn: async ({ mecanographicNumber, qualificationCodes }: {
      mecanographicNumber: number,
      qualificationCodes: string[]
    }) => {
      return await UpdateStaffUseCase(mecanographicNumber, {
        qualificationCodes: qualificationCodes
      });
    },
    meta: {
      invalidatesQuery: getAllStaffMembersQueryKey,
      successMessage: successfullUpdateMessage("Staff Qualifications")
    }
  });
};