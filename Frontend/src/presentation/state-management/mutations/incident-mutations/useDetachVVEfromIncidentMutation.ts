import { useMutation } from "@tanstack/react-query";
import { VVEtoIncidentCommand } from "../../../../application/incident/command/VVEtoIncidentCommand";
import { DetachVVEfromIncidentUseCase } from "../../../../application/incident/IncidentDI";
import { searchIncidentsQueryKey } from "../../query-keys/incidentQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

export const useDetachVVEfromIncidentMutation = () => {
  return useMutation({
    mutationFn: async (command: VVEtoIncidentCommand) => {
      return await DetachVVEfromIncidentUseCase(command);
    },
    meta: {
      invalidatesQuery: searchIncidentsQueryKey,
      successMessage: successfullUpdateMessage("Incident")
    }
  });
};
