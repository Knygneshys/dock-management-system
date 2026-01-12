import { SeverityClassification } from '../../../domain/enums/severityClassification';

export type CreateIncidentTypeCommand = {
  code: string;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
};
