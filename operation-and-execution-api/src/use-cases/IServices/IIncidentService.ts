import { Result } from '../../shared/logic/Result';
import { CreateIncidentCommand } from '../commands/incident/CreateIncidentCommand';
import { IIncidentDTO } from '../dto/incident-dtos/IIncidentDTO';
import { SearchIncidentQuery } from '../queries/incident/SearchIncidentQuery';

export default interface IIncidentService {
  createIncident(createIncidentCommand: CreateIncidentCommand): Promise<Result<IIncidentDTO>>;
  searchIncidents(query: SearchIncidentQuery): Promise<Result<IIncidentDTO[]>>;
  associateVVEtoIncident(vveCode: number, incidentCode: string): Promise<Result<boolean>>;
  detachVVEfromIncident(vveCode: number, incidentCode: string): Promise<Result<boolean>>;
  resolveIncident(incidentCode: string): Promise<Result<IIncidentDTO>>;
}
