import { IncidentStatus } from '../../../domain/enums/incidentStatus';
import { IIncidentTypeDTO } from '../incident-type-dtos/IIncidentTypeDTO';
import { IVVEDTO } from '../vve-dtos/IVVEDTO';

export interface IIncidentDTO {
  code?: string;
  type?: IIncidentTypeDTO;
  startISO?: string;
  endISO?: string;
  description?: string;
  responsibleUserEmail?: string;
  status?: IncidentStatus;
  afectedVVEs?: IVVEDTO[];
  duration?: {
    hour: number;
    minute: number;
  };
}
