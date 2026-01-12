import { useQuery } from "@tanstack/react-query";

import { getVesselByImoQueryKey } from "../../query-keys/vesselQueryKeys";
import { getVesselByImo } from "../../../../infrastructure/api/clients/vesselsApi";

export const useGetVesselByImoQuery = (vesselImo : string) => {
  return useQuery({
    queryKey: [getVesselByImoQueryKey, vesselImo],
    queryFn: () => getVesselByImo(vesselImo),
  });
};