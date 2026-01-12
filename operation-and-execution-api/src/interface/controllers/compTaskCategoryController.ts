import { Inject, Service } from 'typedi';
import ICompTaskCategoryController from './IControllers/ICompTaskCategoryController';
import config from '../../../config';
import ICompTaskCategoryService from '../../use-cases/IServices/ICompTaskCategoryService';
import { Request, Response, NextFunction } from 'express';
import { ICompTaskCategoryDTO } from '../../use-cases/dto/ICompTaskCategoryDTO';
import { Result } from '../../shared/logic/Result';

@Service()
export default class CompTaskCategoryController implements ICompTaskCategoryController {
  constructor(@Inject(config.services.compTaskCategory.name) private ctcService: ICompTaskCategoryService) {}

  public async createCtc(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICompTaskCategoryDTO> | void> {
    try {
      const ctcResult = (await this.ctcService.createCategory(
        req.body as ICompTaskCategoryDTO,
      )) as Result<ICompTaskCategoryDTO>;

      if (ctcResult.isFailure) {
        return res.status(400).json({ error: ctcResult.errorValue() });
      }

      const ctcDto = ctcResult.getValue();
      return res.status(201).json(ctcDto);
    } catch (e) {
      return next(e);
    }
  }

  public async search(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<ICompTaskCategoryDTO[]> | void> {
    try {
      const { name } = req.query;

      const result = await this.ctcService.searchCategories(name as string | undefined);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }
}
