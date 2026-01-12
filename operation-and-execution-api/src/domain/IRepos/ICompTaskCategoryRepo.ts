import { Repo } from '../../shared/infra/Repo';
import { ComplementaryTaskCategory } from '../entities/complementaryTaskCategory';
import { GenericCode } from '../object-values/genericCode';

export default interface ICompTaskCategoryRepo extends Repo<ComplementaryTaskCategory> {
  findByDomainId(code: GenericCode): Promise<ComplementaryTaskCategory | null>;
  search(name?: string): Promise<ComplementaryTaskCategory[]>;
}
