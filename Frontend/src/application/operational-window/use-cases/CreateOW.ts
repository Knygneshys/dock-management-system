import type { IOWRepository } from "../../../domain/interfaces/IOWRepository";
import type { OWCommand } from "../commands/OWCommand";

export function CreateOW(owRepository : IOWRepository) {
    return async (mNumber: number, owCommand : OWCommand) => await owRepository.create(mNumber, owCommand);
}