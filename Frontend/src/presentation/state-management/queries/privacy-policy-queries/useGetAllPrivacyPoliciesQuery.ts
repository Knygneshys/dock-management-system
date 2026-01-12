import { useQuery } from "@tanstack/react-query";
import { getAllPrivacyPoliciesQueryKey } from "../../query-keys/privacyPolicyQueryKeys";
import { GetAllPrivacyPoliciesUseCase } from "../../../../application/privacy-policy/PrivacyPolicyDependencyInjection";

export const useGetAllPrivacyPoliciesQuery = () => {
  return useQuery({
    queryKey: getAllPrivacyPoliciesQueryKey,
    queryFn: GetAllPrivacyPoliciesUseCase,
  });
};
