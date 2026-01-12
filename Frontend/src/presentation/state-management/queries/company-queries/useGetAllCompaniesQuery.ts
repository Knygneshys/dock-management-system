import { useQuery } from "@tanstack/react-query";
import { getAllCompaniesQueryKey } from "../../query-keys/companyQueryKeys";
import { GetAllCompaniesUseCase } from "../../../../application/company/CompanyDependencyInjection";


export const useGetAllCompaniesQuery = () => {
  return useQuery({
    queryKey: getAllCompaniesQueryKey,
    queryFn: GetAllCompaniesUseCase,
  });
};
