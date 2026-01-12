import { useMutation } from "@tanstack/react-query";

import type { StorageAreaCreationDto } from "../../../../infrastructure/dtos/storage-area/storageAreaCreationDto";
import { getAllStorageAreasQueryKey } from "../../query-keys/storageAreaQueryKeys";
import { CreateStAreaUseCase } from "../../../../application/storage-area/StAreaDependencyInjection";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const useCreateStorageAreaMutation = () => {
  return useMutation({
    mutationFn: (storageArea: StorageAreaCreationDto) => {
      return CreateStAreaUseCase(storageArea);
    },
    meta: {
      invalidatesQuery: getAllStorageAreasQueryKey,
      successMessage: successfullCreateMessage("Storage Area")
    }
  });
};
