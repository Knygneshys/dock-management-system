import { CompTaskCategorySearchQuery } from "../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";
import { ICompTaskCategoryRepository } from "../../domain/interfaces/ICompTaskCategoryRepository";
import { CompTaskCategory } from "../../domain/Types/entities/CompTaskCategory";
import { createCompTaskCategory, searchComplementaryTaskCategories } from "../api/oem-clients/compTaskCategoryApi";
import { CreateCompTaskCategoryDTO } from "../dtos/comp-task-category/CreateCompTaskCategoryDTO";

export const ExternalApiCompTaskCategoryRepository: ICompTaskCategoryRepository = {
  search: async function (query: CompTaskCategorySearchQuery): Promise<CompTaskCategory[] | undefined> {
    return await searchComplementaryTaskCategories(query);
  },
  create: async function (dto: CreateCompTaskCategoryDTO): Promise<CompTaskCategory | undefined> {
    return await createCompTaskCategory(dto);
  }
};
