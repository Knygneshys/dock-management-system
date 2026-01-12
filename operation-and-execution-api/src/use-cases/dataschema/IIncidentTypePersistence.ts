import { SeverityClassification } from '../../domain/enums/severityClassification';

export interface IIncidentTypePersistence {
  code: string;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
}
