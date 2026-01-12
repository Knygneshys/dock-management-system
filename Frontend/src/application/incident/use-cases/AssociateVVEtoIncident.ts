import { IIncidentRepository } from "../../../domain/interfaces/IIncidentRepository";
import { VVEtoIncidentCommand } from "../command/VVEtoIncidentCommand";

export function AssociateVVEtoIncident(incidentRepo: IIncidentRepository) {
  return async (command: VVEtoIncidentCommand) => await incidentRepo.associateVve(command);
}
