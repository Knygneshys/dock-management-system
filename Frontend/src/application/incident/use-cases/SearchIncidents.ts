import { IIncidentRepository } from "../../../domain/interfaces/IIncidentRepository";
import { SearchIncidentQuery } from "../queries/SearchIncidentQuery";

export function SearchIncidents(incidentRepo: IIncidentRepository) {
  return async (query: SearchIncidentQuery) => await incidentRepo.search(query);
}
