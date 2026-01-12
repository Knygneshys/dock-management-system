import { useQuery } from "@tanstack/react-query";
import { getStorageAreaByIdQueryKey } from "../../query-keys/storageAreaQueryKeys";
import { GetStAreaByIdUseCase } from "../../../../application/storage-area/StAreaDependencyInjection";

export const useGetStorageAreaByIdQuery = (storageAreaCode: string) => {
  return useQuery({
    queryKey: [getStorageAreaByIdQueryKey, storageAreaCode],
    queryFn: () => GetStAreaByIdUseCase(storageAreaCode)
  });
};
