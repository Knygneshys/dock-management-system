import { useQuery } from "@tanstack/react-query";

import { getVesselTypeByIdQueryKey } from "../../query-keys/vesselTypeQueryKeys";
import { GetVesselTypeByIdUseCase } from "../../../../application/vessel-type/VesselTypeDependencyInjection";

export const useGetVesselTypeByIdQuery = (vesselTypeCode: string) => {
  return useQuery({
    queryKey: [getVesselTypeByIdQueryKey, vesselTypeCode],
    queryFn: () => GetVesselTypeByIdUseCase(vesselTypeCode),
  });
};
