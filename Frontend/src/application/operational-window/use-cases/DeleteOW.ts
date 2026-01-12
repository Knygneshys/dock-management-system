import type { IOWRepository } from "../../../domain/interfaces/IOWRepository";

export function DeleteOW(owRepository : IOWRepository) {
    return async (mNumber: number, code: string) => await owRepository.delete(mNumber, code);
}