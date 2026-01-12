import { SeverityClassification } from "../../../domain/Enums/severityClassification";

export type UpdateIncidentTypeCommand = {
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
};
