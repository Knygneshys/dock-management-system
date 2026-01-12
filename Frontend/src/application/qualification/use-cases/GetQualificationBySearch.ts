import type { IQualificationRepository } from "../../../domain/interfaces/IQualificationRepository";
import type { QualificationSearchQuery } from "../queries/QualificationSearchQuery";

export function GetQualificationBySearch(qualificationRepository : IQualificationRepository) {
    return async (searchQuery : QualificationSearchQuery) => qualificationRepository.getBySearch(searchQuery);
}