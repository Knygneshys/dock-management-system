import { useQuery } from "@tanstack/react-query";
import { getAllQualificationsQueryKey } from "../../query-keys/qualificationQueryKeys";
import { GetAllqualificationsUseCase } from "../../../../application/qualification/QualificationDependencyInjection";



export const useGetAllQualificationsQuery = () => {
  return useQuery({
    queryKey: getAllQualificationsQueryKey,
    queryFn: GetAllqualificationsUseCase,
  });
};
