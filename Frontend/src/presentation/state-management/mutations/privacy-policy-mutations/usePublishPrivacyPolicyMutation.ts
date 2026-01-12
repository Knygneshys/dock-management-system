import { useMutation } from "@tanstack/react-query";
import { PublishPrivacyPolicyCommand } from "../../../../application/privacy-policy/commands/PublishPrivacyPolicyCommand";
import { PublishPrivacyPolicyUseCase } from "../../../../application/privacy-policy/PrivacyPolicyDependencyInjection";
import { getAllPrivacyPoliciesQueryKey } from "../../query-keys/privacyPolicyQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const usePublishPrivacyPolicyMutation = () => {
  return useMutation({
    mutationFn: (command: PublishPrivacyPolicyCommand) => {
      return PublishPrivacyPolicyUseCase(command);
    },
    meta: {
      invalidatesQuery: getAllPrivacyPoliciesQueryKey,
      successMessage: successfullCreateMessage("Privacy Policy"),
    },
  });
};
