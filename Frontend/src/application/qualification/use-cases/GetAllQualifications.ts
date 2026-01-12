import type { IQualificationRepository } from "../../../domain/interfaces/IQualificationRepository";

export function GetAllQualifications(qualificationRepository : IQualificationRepository) {
    return async () => await qualificationRepository.getAll();
}