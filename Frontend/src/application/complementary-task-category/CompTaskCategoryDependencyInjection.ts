import { ExternalApiCompTaskCategoryRepository } from "../../infrastructure/repositories/ExternalApiCompTaskCategoryRepository";
import { CreateCompTaskCategory } from "./use-cases/CreateCompTaskCategory";
import { SearchCompTaskCategories } from "./use-cases/SearchCompTaskCategories";

export const SearchCompTaskCategoriesUseCase = SearchCompTaskCategories(ExternalApiCompTaskCategoryRepository);
export const CreateCompTaskCategoryUseCase = CreateCompTaskCategory(ExternalApiCompTaskCategoryRepository);
