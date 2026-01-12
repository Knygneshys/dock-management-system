import { IncidentType } from '../../domain/entities/incidentType';
import { Result } from '../../shared/logic/Result';
import { CreateIncidentTypeCommand } from '../commands/incident-type/CreateIncidentTypeCommand';
import { UpdateIncidentTypeCommand } from '../commands/incident-type/UpdateIncidentTypeCommand';
import { SearchIncidentTypeQuery } from '../queries/incident-type/SearchIncidentTypeQuery';

export default interface IIncidentTypeService {
  create(command: CreateIncidentTypeCommand): Promise<Result<string>>;

  update(code: string, command: UpdateIncidentTypeCommand): Promise<Result<IncidentType> | Result<string>>;

  getAll(): Promise<Result<IncidentType[]>>;

  search(query: SearchIncidentTypeQuery): Promise<Result<IncidentType[]>>;

  getByCode(code: string): Promise<Result<IncidentType | string>>;
}
