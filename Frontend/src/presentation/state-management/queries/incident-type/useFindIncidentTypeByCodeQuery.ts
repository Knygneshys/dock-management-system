import { useQuery } from "@tanstack/react-query";
import { FindIncidentTypeByCodeUseCase } from "../../../../application/incident-type/IncidentTypeDependencyInjection";

export const useFindIncidentTypeByCodeQuery = (code: string) => {
  return useQuery({
    queryKey: [useFindIncidentTypeByCodeQuery, code],
    queryFn: () => FindIncidentTypeByCodeUseCase(code),
  });
};
