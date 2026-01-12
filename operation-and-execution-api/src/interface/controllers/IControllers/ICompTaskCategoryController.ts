import { NextFunction, Request, Response } from 'express';
import { ICompTaskCategoryDTO } from '../../../use-cases/dto/ICompTaskCategoryDTO';

export default interface ICompTaskCategoryController {
  createCtc(req: Request, res: Response, next: NextFunction): Promise<Response<ICompTaskCategoryDTO> | void>;
  search(req: Request, res: Response, next: NextFunction): Promise<Response<ICompTaskCategoryDTO[]> | void>;
}
