import { StaffStatus } from "../../../domain/Enums/staffStatus";

export type CreateStaffCommand = {
  mecanographicNumber: number;
  name: string;
  email: string;
  phone: number;
  status: StaffStatus;
  qualificationCodes: string[];
  isActive: boolean;
};
