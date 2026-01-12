import { useQuery } from "@tanstack/react-query";
import { searchQualificationsQueryKey } from "../../query-keys/qualificationQueryKeys";
import { GetQualificationsBySearchUseCase } from "../../../../application/qualification/QualificationDependencyInjection";
import type { QualificationSearchQuery } from "../../../../application/qualification/queries/QualificationSearchQuery";

export const useSearchQualificationsQuery = (
  searchQuery: QualificationSearchQuery | null,
  enabled = true
) => {
  return useQuery({
    queryKey: [searchQualificationsQueryKey, searchQuery],
    queryFn: () => GetQualificationsBySearchUseCase(searchQuery!),
    enabled: enabled && searchQuery !== null,
  });
};