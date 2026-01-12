import { ICompTaskCategoryRepository } from "../../../domain/interfaces/ICompTaskCategoryRepository";
import { CreateCompTaskCategoryDTO } from "../../../infrastructure/dtos/comp-task-category/CreateCompTaskCategoryDTO";

export const CreateCompTaskCategory = (repo: ICompTaskCategoryRepository) => {
  return async (dto: CreateCompTaskCategoryDTO) => {
    return await repo.create(dto);
  };
};
