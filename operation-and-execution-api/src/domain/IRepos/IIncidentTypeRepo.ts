import { SearchIncidentTypeQuery } from '../../use-cases/queries/incident-type/SearchIncidentTypeQuery';
import { IncidentType } from '../entities/incidentType';
import { GenericCode } from '../object-values/genericCode';

export interface IIncidentTypeRepo {
  save(incidentType: IncidentType): Promise<IncidentType>;

  findByCode(code: GenericCode): Promise<IncidentType | null>;

  getAll(): Promise<IncidentType[]>;

  search(query: SearchIncidentTypeQuery): Promise<IncidentType[]>;
}
