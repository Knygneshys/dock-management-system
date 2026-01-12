import type { StaffStatus } from "../../../domain/Enums/staffStatus";

export type staffCreateDto = {
  mecanographicNumber: number;
  name: string;
  email: string;
  phone: number;
  status: StaffStatus;
  qualificationCodes: string[];
  isActive: boolean;
};
