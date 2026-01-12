import { IIncidenTypeRepository } from "../../../domain/interfaces/IIncidentTypeRepository";
import { SearchIncidentTypesQuery } from "../queries/SearchIncidentTypesQuery";

export function SearchIncidentTypes(
  incidentTypeRepository: IIncidenTypeRepository,
) {
  return async (query: SearchIncidentTypesQuery) =>
    await incidentTypeRepository.search(query);
}
