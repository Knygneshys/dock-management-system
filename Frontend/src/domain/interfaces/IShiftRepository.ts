import type { CreateShiftCommand } from "../../application/shifts/commands/CreateShiftCommand";
import type { Shift } from "../Types/entities/Shift";

export interface IShiftRepository {
  getAll(): Promise<Shift[]>;

  create(mNumber: number, command: CreateShiftCommand): Promise<Shift | null>;
}
