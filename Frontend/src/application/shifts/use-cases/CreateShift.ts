import type { IShiftRepository } from "../../../domain/interfaces/IShiftRepository";
import type { CreateShiftCommand } from "../commands/CreateShiftCommand";

export function CreateShift(shiftRepository : IShiftRepository) {
    return async (mNumber: number, command : CreateShiftCommand) => await shiftRepository.create(mNumber, command);
}