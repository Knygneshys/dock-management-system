import { StaffStatus } from "../../../domain/Enums/staffStatus";

export type UpdateStaffCommand = {
  name?: string;
  email?: string;
  phone?: number;
  status?: StaffStatus;
  qualificationCodes?: string[];
};
