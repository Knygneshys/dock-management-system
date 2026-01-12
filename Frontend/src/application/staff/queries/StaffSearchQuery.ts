import { StaffStatus } from "../../../domain/Enums/staffStatus";

export type StaffSearchQuery = {
  name: string;
  mNumber: number;
  status: StaffStatus;
  qualificationCodes: string[];
  filterOperator: string;
};
