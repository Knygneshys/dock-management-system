import { SeverityClassification } from '../../../domain/enums/severityClassification';

export type UpdateIncidentTypeCommand = {
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
};
