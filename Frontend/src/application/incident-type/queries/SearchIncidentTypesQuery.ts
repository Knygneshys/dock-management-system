import { SeverityClassification } from "../../../domain/Enums/severityClassification";

export type SearchIncidentTypesQuery = {
  code?: string;
  parentIncidentTypeCode?: string;
  description?: string;
  severity?: SeverityClassification | string;
};
