import type { StaffStatus } from "../../Enums/staffStatus";
import type { OperationalWindow } from "./OperationalWindow";
import type { Qualification } from "./Qualification";

export type StaffMember = {
  mecanographicNumber: number;
  name: string;
  email: string;
  phone: number;
  status: StaffStatus;
  qualifications: Qualification[];
  operationalWindows: OperationalWindow[];
  isActive: boolean;
};
