import type { IQualificationRepository } from "../../../domain/interfaces/IQualificationRepository";

export function GetQualificationByCode(qualificationRepository : IQualificationRepository) {
    return async (code : string) => await qualificationRepository.getByCode(code);
}