import { Repo } from '../../shared/infra/Repo';
import { Incident } from '../entities/incident';
import { IncidentStatus } from '../enums/incidentStatus';
import { GenericCode } from '../object-values/genericCode';

export default interface IIncidentRepo extends Repo<Incident> {
  findByDomainId(incidentCode: GenericCode): Promise<Incident | null>;
  search(from?: Date, until?: Date, status?: IncidentStatus, typeCodes?: string[]): Promise<Incident[]>;
}
