import { useMutation } from "@tanstack/react-query";
import { UpdateIncidentTypeCommand } from "../../../../application/incident-type/command/UpdateIncidentTypeCommand";
import { UpdateIncidentTypeUseCase } from "../../../../application/incident-type/IncidentTypeDependencyInjection";
import { searchIncidentTypesQueryKey } from "../../query-keys/incidentTypeQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

export const useUpdateIncidentTypeMutation = (code: string) => {
  return useMutation({
    mutationFn: (command: UpdateIncidentTypeCommand) =>
      UpdateIncidentTypeUseCase(code, command),
    meta: {
      invalidatesQuery: searchIncidentTypesQueryKey,
      successMessage: successfullUpdateMessage("Vessel Type"),
    },
  });
};
