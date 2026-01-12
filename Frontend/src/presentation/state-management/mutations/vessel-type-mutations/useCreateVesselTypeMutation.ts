import { useMutation } from "@tanstack/react-query";

import { getAllVesselTypesQueryKey } from "../../query-keys/vesselTypeQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import { CreateVesselTypeUseCase } from "../../../../application/vessel-type/VesselTypeDependencyInjection";
import type { VesselType } from "../../../../domain/Types/entities/VesselType";

export const useCreateVesselTypeMutation = () => {
  return useMutation({
    mutationFn: (vesselType: VesselType) => {
      return CreateVesselTypeUseCase(vesselType);
    },
    meta: {
      invalidatesQuery: getAllVesselTypesQueryKey,
      successMessage: successfullCreateMessage("Vessel Type"),
    },
  });
};
