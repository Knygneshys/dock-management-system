import { useQuery } from "@tanstack/react-query";
import { getAllDockRecordsQueryKey } from "../../query-keys/dockRecordQueryKeys";
import { GetAllDockRecordsUseCase } from "../../../../application/dock-record/DockRecordDependencyInjection";



export const useGetAllDockRecordsQuery = () => {
  return useQuery({
    queryKey: getAllDockRecordsQueryKey,
    queryFn: GetAllDockRecordsUseCase,
  });
};
