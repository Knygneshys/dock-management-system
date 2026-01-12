import type { StaffStatus } from "../../../domain/Enums/staffStatus";

export type staffUpdateDto = {
  name?: string;
  email?: string;
  phone?: number;
  status?: StaffStatus;
  qualificationCodes?: string[];
};
