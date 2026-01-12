import { useMutation } from "@tanstack/react-query";

import { getAllVesselTypesQueryKey } from "../../query-keys/vesselTypeQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import { UpdateVesselTypeUseCase } from "../../../../application/vessel-type/VesselTypeDependencyInjection";
import type { VesselType } from "../../../../domain/Types/entities/VesselType";

export const useUpdateVesselTypeMutation = (vesselTypeCode: string) => {
  return useMutation({
    mutationFn: (updatedVesselType: VesselType) =>
      UpdateVesselTypeUseCase(vesselTypeCode, updatedVesselType),
    meta: {
      invalidatesQuery: getAllVesselTypesQueryKey,
      successMessage: successfullUpdateMessage("Vessel Type"),
    },
  });
};
