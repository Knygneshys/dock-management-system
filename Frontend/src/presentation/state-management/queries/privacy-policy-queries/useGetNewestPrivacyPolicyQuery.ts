import { useQuery } from "@tanstack/react-query";
import { GetNewestPrivacyPolicyUseCase } from "../../../../application/privacy-policy/PrivacyPolicyDependencyInjection";
import { getNewestPrivacyPolicyQueryKey } from "../../query-keys/privacyPolicyQueryKeys";

export const useGetNewestPrivacyPolicyQuery = () => {
  return useQuery({
    queryKey: [getNewestPrivacyPolicyQueryKey],
    queryFn: () => GetNewestPrivacyPolicyUseCase(),
  });
};
