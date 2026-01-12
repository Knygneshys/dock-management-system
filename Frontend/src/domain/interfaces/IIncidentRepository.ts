import { VVEtoIncidentCommand } from "../../application/incident/command/VVEtoIncidentCommand";
import { CreateIncidentCommand } from "../../application/incident/command/CreateIncidentComman";
import { SearchIncidentQuery } from "../../application/incident/queries/SearchIncidentQuery";
import { Incident } from "../Types/entities/Incident";

export interface IIncidentRepository {
  create(createCommand: CreateIncidentCommand): Promise<Incident>;
  search(query: SearchIncidentQuery): Promise<Incident[]>;
  associateVve(associateCommand: VVEtoIncidentCommand): Promise<boolean>;
  detachVve(associateCommand: VVEtoIncidentCommand): Promise<boolean>;
  resolve(incidentCode: string): Promise<Incident>;
}
