import { CreateIncidentCommand } from "../../application/incident/command/CreateIncidentComman";
import { VVEtoIncidentCommand } from "../../application/incident/command/VVEtoIncidentCommand";
import { SearchIncidentQuery } from "../../application/incident/queries/SearchIncidentQuery";
import { IIncidentRepository } from "../../domain/interfaces/IIncidentRepository";
import { Incident } from "../../domain/Types/entities/Incident";
import {
  associateVVEtoIncident,
  createIncident,
  detachVVEfromIncident,
  resolveIncident,
  searchIncidents
} from "../api/oem-clients/incidentApi";

export const ExternalApiIncidentRepository: IIncidentRepository = {
  create: async function (createCommand: CreateIncidentCommand): Promise<Incident> {
    return await createIncident(createCommand);
  },
  search: async function (query: SearchIncidentQuery): Promise<Incident[]> {
    return await searchIncidents(query);
  },
  associateVve: async function (associateCommand: VVEtoIncidentCommand): Promise<boolean> {
    return await associateVVEtoIncident(associateCommand);
  },
  detachVve: async function (associateCommand: VVEtoIncidentCommand): Promise<boolean> {
    return await detachVVEfromIncident(associateCommand);
  },
  resolve: async function (incidentCode: string): Promise<Incident> {
    return await resolveIncident(incidentCode);
  }
};
