import { IVVERepository } from "../../../domain/interfaces/IVVERepository";
import { VVE } from "../../../domain/Types/entities/VVE";
import { VVESearchQuery } from "../queries/VVESearchQuery";

export const SearchVVEs = (repo: IVVERepository) => {
  return async (query: VVESearchQuery | null): Promise<VVE[]> => {
    if (!query) {
      return await repo.getAll();
    }
    return await repo.search(query);
  };
};