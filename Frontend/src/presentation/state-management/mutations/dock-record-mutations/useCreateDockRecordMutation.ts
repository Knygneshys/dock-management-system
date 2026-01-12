import { useMutation } from "@tanstack/react-query";

import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import type { DockRecordCreateDto } from "../../../../infrastructure/dtos/dock-record/DockRecordCreateDto";
import { getAllDockRecordsQueryKey } from "../../query-keys/dockRecordQueryKeys";
import { CreateDockRecordUseCase } from "../../../../application/dock-record/DockRecordDependencyInjection";

export const useCreateDockRecordMutation = () => {
  return useMutation({
    mutationFn: (dockRecord: DockRecordCreateDto) => {
      return CreateDockRecordUseCase(dockRecord);
    },
    meta: {
      invalidatesQuery: getAllDockRecordsQueryKey,
      successMessage: successfullCreateMessage("Dock Record"),
    },
  });
};
