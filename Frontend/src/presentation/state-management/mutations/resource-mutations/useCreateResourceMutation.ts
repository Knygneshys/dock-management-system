import { useMutation } from "@tanstack/react-query";

import type { ResourceCreateDto } from "../../../../infrastructure/dtos/resource/resourceCreateDto";
import { CreateResourceUseCase } from "../../../../application/resource/ResourceDI";
import { getAllResourcesQueryKey } from "../../query-keys/resourceQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const useCreateResourceMutation = () => {
  return useMutation({
    mutationFn: (resource: ResourceCreateDto) => CreateResourceUseCase(resource),
    meta: {
      invalidatesQuery: [getAllResourcesQueryKey],
      successMessage: successfullCreateMessage("Resource"),
      errorMessage: "Resource"
    }
  });
};
