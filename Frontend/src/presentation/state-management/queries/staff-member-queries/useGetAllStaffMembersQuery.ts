import { useQuery } from "@tanstack/react-query";
import { getAllStaffMembersQueryKey } from "../../query-keys/staffMemberQueryKeys";
import { getAllStaffMembers } from "../../../../infrastructure/api/clients/staffMemberApi";



export const useGetAllStaffMembersQuery = () => {
  return useQuery({
    queryKey: getAllStaffMembersQueryKey,
    queryFn: getAllStaffMembers,
  });
};
