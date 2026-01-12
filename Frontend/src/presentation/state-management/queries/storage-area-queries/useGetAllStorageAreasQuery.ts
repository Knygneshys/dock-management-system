import { useQuery } from "@tanstack/react-query";
import { getAllStorageAreasQueryKey } from "../../query-keys/storageAreaQueryKeys";
import { GetAllStAreasUseCase } from "../../../../application/storage-area/StAreaDependencyInjection";

export const useGetAllStorageAreasQuery = () => {
  return useQuery({
    queryKey: getAllStorageAreasQueryKey,
    queryFn: GetAllStAreasUseCase
  });
};
