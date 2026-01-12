import { useQuery } from "@tanstack/react-query";
import { getUserRoleQueryKey } from "../../query-keys/userQueryKeys";
import { GetUserRoleUsecase } from "../../../../application/user/UserDI";

export const useGetUserRoleQuery = (email: string) => {
  return useQuery({
    queryKey: getUserRoleQueryKey,
    queryFn: () => GetUserRoleUsecase(email)
  });
};
