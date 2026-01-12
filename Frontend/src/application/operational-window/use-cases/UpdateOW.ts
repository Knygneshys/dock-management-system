import type { IOWRepository } from "../../../domain/interfaces/IOWRepository";
import type { OWCommand } from "../commands/OWCommand";

export function UpdateOW(owRepository : IOWRepository) {
    return async (mNumber: number, code: string, owCommand : OWCommand) => await owRepository.update(mNumber, code, owCommand);
}