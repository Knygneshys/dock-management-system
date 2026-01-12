import { SeverityClassification } from '../../../domain/enums/severityClassification';

export type SearchIncidentTypeQuery = {
  code?: string;
  parentIncidentTypeCode?: string;
  description?: string;
  severity?: SeverityClassification;
};
