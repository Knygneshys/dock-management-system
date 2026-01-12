import { useQuery } from "@tanstack/react-query";

import { getAllVesselsQueryKey } from "../../query-keys/vesselQueryKeys";
import { GetAllVesselsUseCase } from "../../../../application/vessel/VesselDependencyInjection";

export const useGetAllVesselsQuery = () => {
  return useQuery({
    queryKey: getAllVesselsQueryKey,
    queryFn: GetAllVesselsUseCase,
  });
};
