import type { IShiftRepository } from "../../../domain/interfaces/IShiftRepository";

export function GetAllshifts(shiftRepository : IShiftRepository) {
    return async () => await shiftRepository.getAll();
}