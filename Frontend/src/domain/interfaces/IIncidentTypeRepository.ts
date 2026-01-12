import { UpdateIncidentTypeCommand } from "../../application/incident-type/command/UpdateIncidentTypeCommand";
import { SearchIncidentTypesQuery } from "../../application/incident-type/queries/SearchIncidentTypesQuery";
import { IncidentType } from "../Types/entities/IncidentType";

export interface IIncidenTypeRepository {
  search(query: SearchIncidentTypesQuery): Promise<IncidentType[]>;

  create(incidentType: IncidentType): Promise<string | null>;

  update(
    code: string,
    command: UpdateIncidentTypeCommand,
  ): Promise<IncidentType | null>;

  findByCode(code: string): Promise<IncidentType | null>;
}
