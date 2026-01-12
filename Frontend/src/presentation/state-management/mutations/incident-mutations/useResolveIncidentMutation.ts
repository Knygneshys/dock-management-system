import { useMutation } from "@tanstack/react-query";
import { ResolveIncidentUseCase } from "../../../../application/incident/IncidentDI";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";
import { searchIncidentsQueryKey } from "../../query-keys/incidentQueryKeys";

export const useResolveIncidentMutation = () => {
  return useMutation({
    mutationFn: async (code: string) => {
      return await ResolveIncidentUseCase(code);
    },
    meta: {
      invalidatesQuery: searchIncidentsQueryKey,
      successMessage: successfullUpdateMessage("Incident")
    }
  });
};
