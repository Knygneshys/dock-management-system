import type { IQualificationRepository } from "../../../domain/interfaces/IQualificationRepository";
import type { UpdateQualificationCommand } from "../commands/UpdateQualificationCommand";

export function UpdateQualification(qualificationRepository : IQualificationRepository) {
    return async (code : string, command : UpdateQualificationCommand) => await qualificationRepository.update(code, command);
}