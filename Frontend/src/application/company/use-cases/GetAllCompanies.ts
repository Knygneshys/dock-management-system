import type { ICompanyRepository } from "../../../domain/interfaces/ICompanyRepository";

export function getAllCompanies(companyRepository : ICompanyRepository) {
    return async () => await companyRepository.getAll();
}