import type { CreateStaffCommand } from "../../application/staff/commands/CreateStaffCommand";
import type { UpdateStaffCommand } from "../../application/staff/commands/UpdateStaffCommand";
import type { StaffMember } from "../Types/entities/StaffMember";

export interface IStaffRepository {
  getAll(): Promise<StaffMember[]>;

  create(command: CreateStaffCommand): Promise<number | null>;

  update(
    mNumber: number,
    command: UpdateStaffCommand
  ): Promise<StaffMember | null>;

  deactivate(mNumber: number): Promise<StaffMember | null>;

  activate(mNumber: number): Promise<StaffMember | null>;
}
