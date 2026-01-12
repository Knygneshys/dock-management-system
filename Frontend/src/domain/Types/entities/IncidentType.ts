import { SeverityClassification } from "../../Enums/severityClassification";

export type IncidentType = {
  code: string;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
};
