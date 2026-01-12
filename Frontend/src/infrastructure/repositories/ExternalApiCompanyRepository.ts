import type { ICompanyRepository } from "../../domain/interfaces/ICompanyRepository";
import type { Company } from "../../domain/Types/entities/Company";
import { getAllCompanies } from "../api/clients/companiesApi";

export const ExternalCompanyRepository: ICompanyRepository = {
  getAll: async function (): Promise<Company[]> {
    return await getAllCompanies();
  },
};
