import { IncidentStatus } from '../../../domain/enums/incidentStatus';
import { SeverityClassification } from '../../../domain/enums/severityClassification';

export type SearchIncidentQuery = {
  startDate?: Date;
  endDate?: Date;
  status?: IncidentStatus;
  severity?: SeverityClassification;
  vveCode?: number;
};
