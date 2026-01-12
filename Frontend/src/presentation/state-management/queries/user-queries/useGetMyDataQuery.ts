import { useQuery } from "@tanstack/react-query";
import { getMyData } from "../../../../infrastructure/api/clients/userApi";

export const useGetMyDataQuery = () => {
  return useQuery({
    queryKey: ["getMyData"],
    queryFn: getMyData,
  });
};
