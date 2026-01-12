import { useMutation } from "@tanstack/react-query";
import { VVEtoIncidentCommand } from "../../../../application/incident/command/VVEtoIncidentCommand";
import { AssociateVVEtoIncidentUseCase } from "../../../../application/incident/IncidentDI";
import { searchIncidentsQueryKey } from "../../query-keys/incidentQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

export const useAssociateVVEtoIncidentMutation = () => {
  return useMutation({
    mutationFn: async (command: VVEtoIncidentCommand) => {
      return await AssociateVVEtoIncidentUseCase(command);
    },
    meta: {
      invalidatesQuery: searchIncidentsQueryKey,
      successMessage: successfullUpdateMessage("Complementary Task Category")
    }
  });
};
