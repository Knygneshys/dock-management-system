import { useQuery } from "@tanstack/react-query";
import { getDockRecordByIdQueryKey } from "../../query-keys/dockRecordQueryKeys";
import { GetDockRecordByIdUseCase } from "../../../../application/dock-record/DockRecordDependencyInjection";



export const useGetDockRecordByIdQuery = (dockRecordCode : string) => {
  return useQuery({
    queryKey: [getDockRecordByIdQueryKey, dockRecordCode],
    queryFn: () => GetDockRecordByIdUseCase(dockRecordCode),
  });
};
