import { useMutation } from "@tanstack/react-query";

import type { StorageAreaUpdateDto } from "../../../../infrastructure/dtos/storage-area/storageAreaUpdateDto";
import { getAllStorageAreasQueryKey } from "../../query-keys/storageAreaQueryKeys";
import { UpdateStAreaUseCase } from "../../../../application/storage-area/StAreaDependencyInjection";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

export const useUpdateStorageAreaMutation = (storageAreaCode: string) => {
  return useMutation({
    mutationFn: (updatedStorageArea: StorageAreaUpdateDto) => UpdateStAreaUseCase(storageAreaCode, updatedStorageArea),
    meta: {
      invalidatesQuery: getAllStorageAreasQueryKey,
      successMessage: successfullUpdateMessage("Storage Area")
    }
  });
};
