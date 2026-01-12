import { IIncidentRepository } from "../../../domain/interfaces/IIncidentRepository";
import { VVEtoIncidentCommand } from "../command/VVEtoIncidentCommand";

export function DetachVVEfromIncident(incidentRepo: IIncidentRepository) {
  return async (command: VVEtoIncidentCommand) => await incidentRepo.detachVve(command);
}
