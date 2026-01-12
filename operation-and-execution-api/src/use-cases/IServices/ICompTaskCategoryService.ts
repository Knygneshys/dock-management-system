import { Result } from '../../shared/logic/Result';
import { ICompTaskCategoryDTO } from '../dto/ICompTaskCategoryDTO';

export default interface ICompTaskCategoryService {
  createCategory(dto: ICompTaskCategoryDTO): Promise<Result<ICompTaskCategoryDTO>>;
  searchCategories(name?: string): Promise<Result<ICompTaskCategoryDTO[]>>;
}
