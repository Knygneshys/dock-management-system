import { CompTaskCategorySearchQuery } from "../../application/complementary-task-category/queries/CompTaskCategorySearchQuery";
import { CreateCompTaskCategoryDTO } from "../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";
import { CompTaskCategory } from "../Types/entities/CompTaskCategory";

export interface ICompTaskCategoryRepository {
  search(query: CompTaskCategorySearchQuery): Promise<CompTaskCategory[] | undefined>;
  create(dto: CreateCompTaskCategoryDTO): Promise<CompTaskCategory | undefined>;
}
