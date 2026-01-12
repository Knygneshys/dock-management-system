import { IncidentStatus } from "../../Enums/incidentStatus";
import { Time } from "../value-objects/Time";
import { IncidentType } from "./IncidentType";
import { VVE } from "./VVE";

export type Incident = {
  code: string;
  type: IncidentType;
  startISO: string;
  endISO?: string;
  description: string;
  responsibleUserEmail: string;
  status: IncidentStatus;
  afectedVVEs: VVE[];
  duration?: Time;
};
