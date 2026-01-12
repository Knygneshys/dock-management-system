import { useMutation } from "@tanstack/react-query";
import { CreateIncidentCommand } from "../../../../application/incident/command/CreateIncidentComman";
import { CreateIncidentUseCase } from "../../../../application/incident/IncidentDI";
import { searchIncidentsQueryKey } from "../../query-keys/incidentQueryKeys";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

export const useCreateIncidentMutation = () => {
  return useMutation({
    mutationFn: async (command: CreateIncidentCommand) => {
      return await CreateIncidentUseCase(command);
    },
    meta: {
      invalidatesQuery: searchIncidentsQueryKey,
      successMessage: successfullCreateMessage("Incident")
    }
  });
};
