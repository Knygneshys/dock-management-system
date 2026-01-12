import { SeverityClassification } from '../../../domain/enums/severityClassification';

export interface IIncidentTypeDTO {
  code: string;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode?: string;
}
