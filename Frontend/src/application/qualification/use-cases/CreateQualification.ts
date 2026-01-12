import type { IQualificationRepository } from "../../../domain/interfaces/IQualificationRepository";
import type { CreateQualificationCommand } from "../commands/CreateQualificationCommand";

export function CreateQualification(qualificationRepository : IQualificationRepository) {
    return async (qualification : CreateQualificationCommand) => await qualificationRepository.create(qualification);
}