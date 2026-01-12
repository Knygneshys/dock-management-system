import { useMutation } from "@tanstack/react-query";

import { ReactivateResourceUseCase } from "../../../../application/resource/ResourceDI";
import { getAllResourcesQueryKey } from "../../query-keys/resourceQueryKeys";
import { successfullActivationMessage } from "../../../utils/toastMessageUtils";

export const useReactivateResourceMutation = () => {
  return useMutation({
    mutationFn: (code: string) => ReactivateResourceUseCase(code),
    meta: {
      invalidatesQuery: [getAllResourcesQueryKey],
      successMessage: successfullActivationMessage("Resource"),
      errorMessage: "Resource"
    }
  });
};
