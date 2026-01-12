import { useQuery } from "@tanstack/react-query";
import { getAllCompTasksQueryKey } from "../../query-keys/compTaskQueryKeys";
import { GetAllCompTasksUseCase } from "../../../../application/complementary-task/CompTaskDependencyInjection";

export const useGetAllCompTasksQuery = () => {
  return useQuery({
    queryKey: getAllCompTasksQueryKey,
    queryFn: async () => {
      return await GetAllCompTasksUseCase();
    }
  });
};