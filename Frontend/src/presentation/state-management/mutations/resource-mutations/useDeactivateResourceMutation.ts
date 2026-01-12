import { useMutation } from "@tanstack/react-query";

import { DeactivateResourceUseCase } from "../../../../application/resource/ResourceDI";
import { getAllResourcesQueryKey } from "../../query-keys/resourceQueryKeys";
import { successfullDeactivationMessage } from "../../../utils/toastMessageUtils";

export const useDeactivateResourceMutation = () => {
  return useMutation({
    mutationFn: (code: string) => DeactivateResourceUseCase(code),
    meta: {
      invalidatesQuery: [getAllResourcesQueryKey],
      successMessage: successfullDeactivationMessage("Resource"),
      errorMessage: "Resource"
    }
  });
};
