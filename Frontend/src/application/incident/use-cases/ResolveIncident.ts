import { IIncidentRepository } from "../../../domain/interfaces/IIncidentRepository";

export function ResolveIncident(incidentRepo: IIncidentRepository) {
  return async (code: string) => await incidentRepo.resolve(code);
}
