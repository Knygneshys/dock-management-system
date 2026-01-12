import { useQuery } from "@tanstack/react-query";
import { GetAllUsersUsecase } from "../../../../application/user/UserDI";
import { getAllUsersQueryKey } from "../../query-keys/userQueryKeys";

export default function useGetAllUsersQuery() {
  return useQuery({
    queryKey: getAllUsersQueryKey,
    queryFn: GetAllUsersUsecase
  });
}
