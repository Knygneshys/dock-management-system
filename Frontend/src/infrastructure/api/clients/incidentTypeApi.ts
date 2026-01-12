import axios from "axios";
import { SearchIncidentTypesQuery } from "../../../application/incident-type/queries/SearchIncidentTypesQuery";
import { IncidentType } from "../../../domain/Types/entities/IncidentType";
import { incidentTypeUris, vesselTypeUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";
import { UpdateIncidentTypeCommand } from "../../../application/incident-type/command/UpdateIncidentTypeCommand";

export const searchIncidentTypes = async (query: SearchIncidentTypesQuery) => {
  try {
    const params = new URLSearchParams();
    if (query.code) {
      params.append("code", query.code);
    }

    if (query.parentIncidentTypeCode) {
      params.append("parentIncidentTypeCode", query.parentIncidentTypeCode);
    }

    if (query.description) {
      params.append("description", query.description);
    }

    if (query.severity) {
      params.append("severity", query.severity);
    }

    const uri = `${incidentTypeUris.SEARCH}?${params.toString()}`;

    const result = await apiClient.get<IncidentType[]>(uri);

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createIncidentType = async (incidentType: IncidentType) => {
  try {
    const result = await apiClient.post<string>(
      incidentTypeUris.CREATE,
      incidentType,
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateIncidentType = async (
  code: string,
  command: UpdateIncidentTypeCommand,
) => {
  try {
    const result = await apiClient.put<IncidentType>(
      incidentTypeUris.UPDATE(code),
      command,
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findIncidentTypeByCode = async (code: string) => {
  try {
    const result = await apiClient.get<IncidentType>(
      incidentTypeUris.FIND_BY_CODE(code),
    );

    return result.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
