import { IIncidentRepository } from "../../../domain/interfaces/IIncidentRepository";
import { CreateIncidentCommand } from "../command/CreateIncidentComman";

export function CreateIncident(incidentRepo: IIncidentRepository) {
  return async (createCommand: CreateIncidentCommand) => await incidentRepo.create(createCommand);
}
