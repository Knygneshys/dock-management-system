import { ExternalCompanyRepository } from "../../infrastructure/repositories/ExternalApiCompanyRepository";
import { getAllCompanies } from "./use-cases/GetAllCompanies";

export const GetAllCompaniesUseCase = getAllCompanies(ExternalCompanyRepository);