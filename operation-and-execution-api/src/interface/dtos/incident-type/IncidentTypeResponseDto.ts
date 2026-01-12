import { SeverityClassification } from '../../../domain/enums/severityClassification';

export type IncidentTypeResponseDto = {
  code: string;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
};
