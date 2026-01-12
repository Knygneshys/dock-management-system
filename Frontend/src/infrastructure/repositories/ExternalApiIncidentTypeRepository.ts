import { UpdateIncidentTypeCommand } from "../../application/incident-type/command/UpdateIncidentTypeCommand";
import { SearchIncidentTypesQuery } from "../../application/incident-type/queries/SearchIncidentTypesQuery";
import { IIncidenTypeRepository } from "../../domain/interfaces/IIncidentTypeRepository";
import { IncidentType } from "../../domain/Types/entities/IncidentType";
import {
  createIncidentType,
  findIncidentTypeByCode,
  searchIncidentTypes,
  updateIncidentType,
} from "../api/clients/incidentTypeApi";

export const ExternalApiIncidentTypeRepository: IIncidenTypeRepository = {
  search: async function (
    query: SearchIncidentTypesQuery,
  ): Promise<IncidentType[]> {
    const incidentTypes = await searchIncidentTypes(query);

    return incidentTypes;
  },

  create: async function (incidentType: IncidentType): Promise<string | null> {
    const createdIncidentTypeCode = await createIncidentType(incidentType);

    return createdIncidentTypeCode;
  },

  update: async function (
    code: string,
    command: UpdateIncidentTypeCommand,
  ): Promise<IncidentType | null> {
    const updatedIncidentType = await updateIncidentType(code, command);

    return updatedIncidentType;
  },

  findByCode: async function (code: string): Promise<IncidentType | null> {
    const incidentType = await findIncidentTypeByCode(code);

    return incidentType;
  },
};
