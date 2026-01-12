import { useMutation } from "@tanstack/react-query";

import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import type { DockRecordUpdateDto } from "../../../../infrastructure/dtos/dock-record/DockRecordUpdateDto";
import { getAllDockRecordsQueryKey } from "../../query-keys/dockRecordQueryKeys";
import { UpdateDockRecordUseCase } from "../../../../application/dock-record/DockRecordDependencyInjection";

export const useUpdateDockRecordMutation = (dockRecordCode: string) => {
  return useMutation({
    mutationFn: (updatedDockRecord: DockRecordUpdateDto) =>
      UpdateDockRecordUseCase(dockRecordCode, updatedDockRecord),
    meta: {
      invalidatesQuery: getAllDockRecordsQueryKey,
      successMessage: successfullUpdateMessage("Dock Record"),
    },
  });
};
