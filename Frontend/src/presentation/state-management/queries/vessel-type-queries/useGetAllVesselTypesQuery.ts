import { useQuery } from "@tanstack/react-query";

import { getAllVesselTypesQueryKey } from "../../query-keys/vesselTypeQueryKeys";
import { GetAllVesselTypesUseCase } from "../../../../application/vessel-type/VesselTypeDependencyInjection";

export const useGetAllVesselTypesQuery = () => {
  return useQuery({
    queryKey: getAllVesselTypesQueryKey,
    queryFn: GetAllVesselTypesUseCase,
  });
};
