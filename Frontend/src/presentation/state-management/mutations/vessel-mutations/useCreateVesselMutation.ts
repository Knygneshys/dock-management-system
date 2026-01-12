import { useMutation } from "@tanstack/react-query";

import { getAllVesselsQueryKey } from "../../query-keys/vesselQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import { CreateVesselUseCase } from "../../../../application/vessel/VesselDependencyInjection";
import type { CreateVesselCommand } from "../../../../application/vessel/commands/CreateVesselCommand";

export const useCreateVesselMutation = () => {
  return useMutation({
    mutationFn: (vessel : CreateVesselCommand) => CreateVesselUseCase(vessel),
    meta: {
      invalidatesQuery: getAllVesselsQueryKey,
      successMessage: successfullCreateMessage("Vessel")
    }
  });
};
