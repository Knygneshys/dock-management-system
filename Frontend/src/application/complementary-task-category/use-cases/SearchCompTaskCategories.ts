import { ICompTaskCategoryRepository } from "../../../domain/interfaces/ICompTaskCategoryRepository";
import { CompTaskCategorySearchQuery } from "../queries/CompTaskCategorySearchQuery";

export const SearchCompTaskCategories = (repo: ICompTaskCategoryRepository) => {
  return async (query: CompTaskCategorySearchQuery) => {
    return await repo.search(query);
  };
};
