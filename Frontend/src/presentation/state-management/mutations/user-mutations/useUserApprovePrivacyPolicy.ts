import { useMutation } from "@tanstack/react-query";
import { ApprovePrivacyPolicyUseCase } from "../../../../application/user/UserDI";
import { successfullApprovalMessage } from "../../../utils/toastMessageUtils";

export const useUserApprovePrivacyPolicy = () => {
  return useMutation({
    mutationFn: (email: string) => ApprovePrivacyPolicyUseCase(email),
    meta: {
      successMessage: successfullApprovalMessage("Privacy Policy"),
      errorMessage: "Failed to update role.",
    },
  });
};
