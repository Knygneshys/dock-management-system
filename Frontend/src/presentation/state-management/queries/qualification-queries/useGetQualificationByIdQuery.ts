import { useQuery } from "@tanstack/react-query";
import { getQualificationByIdKey } from "../../query-keys/qualificationQueryKeys";
import { GetQualificationByCodeUseCase } from "../../../../application/qualification/QualificationDependencyInjection";



export const useGetQualificationByIdQuery = (qualificationCode : string) => {
  return useQuery({
    queryKey: [getQualificationByIdKey, qualificationCode],
    queryFn: () => GetQualificationByCodeUseCase(qualificationCode),
  });
};
