import { Inject, Service } from 'typedi';
import ICompTaskCategoryService from '../IServices/ICompTaskCategoryService';
import { Result } from '../../shared/logic/Result';
import { ICompTaskCategoryDTO } from '../dto/ICompTaskCategoryDTO';
import config from '../../../config';
import ICompTaskCategoryRepo from '../../domain/IRepos/ICompTaskCategoryRepo';
import { GenericCode } from '../../domain/object-values/genericCode';
import { CompTaskCategoryMap } from '../mappers/CompTaskCategoryMap';
import { ComplementaryTaskCategory } from '../../domain/entities/complementaryTaskCategory';

@Service()
export default class CompTaskCategoryService implements ICompTaskCategoryService {
  constructor(@Inject(config.repos.compTaskCategory.name) private ctcRepo: ICompTaskCategoryRepo) {}

  public async createCategory(dto: ICompTaskCategoryDTO): Promise<Result<ICompTaskCategoryDTO>> {
    //code is auto generated
    let code: GenericCode;
    do {
      const rawCode = 'CTC-' + Math.floor(Math.random() * 101);
      code = GenericCode.create(rawCode).getValue()!;
    } while (await this.ctcRepo.findByDomainId(code));

    dto.code = code.value;
    const propsResult = CompTaskCategoryMap.toDomainPropos(dto);
    if (propsResult.isFailure) {
      return Result.fail<ICompTaskCategoryDTO>(propsResult.errorValue());
    }

    const ctcResult = ComplementaryTaskCategory.create(propsResult.getValue()!);
    if (ctcResult.isFailure) {
      return Result.fail<ICompTaskCategoryDTO>(ctcResult.errorValue());
    }

    await this.ctcRepo.save(ctcResult.getValue()!);

    const ctcRetDto = CompTaskCategoryMap.toDTO(ctcResult.getValue()!);

    return Result.ok<ICompTaskCategoryDTO>(ctcRetDto);
  }

  public async searchCategories(name?: string): Promise<Result<ICompTaskCategoryDTO[]>> {
    const ctcs = await this.ctcRepo.search(name);
    const ctcDtos: ICompTaskCategoryDTO[] = [];
    const errors: string[] = [];

    for (const ctc of ctcs) {
      try {
        const dto = CompTaskCategoryMap.toDTO(ctc);
        ctcDtos.push(dto);
      } catch (mapperError) {
        errors.push(`Failed to map Complementary Task Category ${ctc.code.value}: ${mapperError}`);
      }
    }

    if (errors.length > 0) {
      console.warn('Some Complementary Task Categories failed to map to DTO:', errors.join('; '));
    }

    return Result.ok<ICompTaskCategoryDTO[]>(ctcDtos);
  }
}
