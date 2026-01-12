import { IncidentStatus } from "../../../domain/Enums/incidentStatus";
import { SeverityClassification } from "../../../domain/Enums/severityClassification";

export type SearchIncidentQuery = {
  startDate?: Date;
  endDate?: Date;
  status?: IncidentStatus;
  severity?: SeverityClassification;
  vveCode?: number;
};
