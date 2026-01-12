import { useMutation } from "@tanstack/react-query";

import { getAllVesselsQueryKey }
  from "../../query-keys/vesselQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import { UpdateVesselUseCase } from "../../../../application/vessel/VesselDependencyInjection";
import type { UpdateVesselCommand } from "../../../../application/vessel/commands/UpdateVesselCommand";

export const useUpdateVesselMutation = (vesselImo : string) => {
  return useMutation({
    mutationFn: (command : UpdateVesselCommand) => UpdateVesselUseCase(vesselImo, command),
    meta: {
      invalidatesQuery: getAllVesselsQueryKey,
      successMessage: successfullUpdateMessage("Vessel")
    }
  });
};