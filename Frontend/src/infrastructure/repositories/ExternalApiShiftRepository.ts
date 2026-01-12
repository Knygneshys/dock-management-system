import type { CreateShiftCommand } from "../../application/shifts/commands/CreateShiftCommand";
import type { IShiftRepository } from "../../domain/interfaces/IShiftRepository";
import type { Shift } from "../../domain/Types/entities/Shift";
import { getAllShifts, createShift } from "../api/clients/shiftsApi";
import { mapCreateShiftCommandToCreateShiftDto } from "../mappers/shiftMapper";

export const ExternalApiShiftRepository: IShiftRepository = {
  getAll: async function (): Promise<Shift[]> {
    return await getAllShifts();
  },

  create: async function (
    mNumber: number,
    command: CreateShiftCommand
  ): Promise<Shift | null> {
    const dto = mapCreateShiftCommandToCreateShiftDto(command);

    return await createShift(mNumber, dto);
  },
};
