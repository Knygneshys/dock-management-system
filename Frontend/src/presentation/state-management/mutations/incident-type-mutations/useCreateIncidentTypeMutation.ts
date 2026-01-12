import { useMutation } from "@tanstack/react-query";
import { IncidentType } from "../../../../domain/Types/entities/IncidentType";
import { CreateIncidentTypeUseCase } from "../../../../application/incident-type/IncidentTypeDependencyInjection";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import { searchIncidentTypesQueryKey } from "../../query-keys/incidentTypeQueryKeys";

export const useCreateIncidentTypeMutation = () => {
  return useMutation({
    mutationFn: (incidentType: IncidentType) => {
      return CreateIncidentTypeUseCase(incidentType);
    },
    meta: {
      invalidatesQuery: searchIncidentTypesQueryKey,
      successMessage: successfullCreateMessage("Vessel Type"),
    },
  });
};
