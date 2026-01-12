import type { Company } from "../Types/entities/Company";

export interface ICompanyRepository {
  getAll(): Promise<Company[]>;
}
