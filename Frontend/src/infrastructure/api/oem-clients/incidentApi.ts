import { CreateIncidentCommand } from "../../../application/incident/command/CreateIncidentComman";
import { VVEtoIncidentCommand } from "../../../application/incident/command/VVEtoIncidentCommand";
import { SearchIncidentQuery } from "../../../application/incident/queries/SearchIncidentQuery";
import { Incident } from "../../../domain/Types/entities/Incident";
import { incidentUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const createIncident = async (command: CreateIncidentCommand): Promise<Incident> => {
  const res = await apiClient.post<Incident>(incidentUris.create, command);
  return res.data;
};

export const searchIncidents = async (query: SearchIncidentQuery): Promise<Incident[]> => {
  const params = new URLSearchParams();

  if (query.startDate) {
    params.append("startDate", query.startDate.toISOString());
  }
  if (query.endDate) {
    params.append("endDate", query.endDate.toISOString());
  }
  if (query.severity) {
    params.append("severity", query.severity);
  }
  if (query.status) {
    params.append("status", query.status);
  }
  if (query.vveCode) {
    params.append("vveCode", query.vveCode.toString());
  }

  const res = await apiClient.get<Incident[]>(`${incidentUris.search}?${params.toString()}`);

  return res.data;
};

export const associateVVEtoIncident = async (associateCommand: VVEtoIncidentCommand): Promise<boolean> => {
  const res = await apiClient.post<boolean>(incidentUris.associateVVE, associateCommand);
  return res.data;
};

export const detachVVEfromIncident = async (associateCommand: VVEtoIncidentCommand): Promise<boolean> => {
  const res = await apiClient.delete<boolean>(incidentUris.detachVVE, { data: associateCommand });
  return res.data;
};

export const resolveIncident = async (incidentCode: string): Promise<Incident> => {
  const res = await apiClient.patch<Incident>(incidentUris.resolve(incidentCode));
  return res.data;
};
