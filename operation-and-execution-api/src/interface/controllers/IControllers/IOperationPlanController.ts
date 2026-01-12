import { NextFunction, Request, Response } from 'express';
import { OperationPlanResponseDto } from '../../dtos/operation-plan/OperationPlanResponseDto';
import { OperationPlanSummaryDto } from '../../dtos/operation-plan/OperationPlanSummaryDto';

export default interface IOperationPlanController {
  create(req: Request, res: Response, next: NextFunction): Promise<Response<string> | void>;

  update(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto> | void>;

  getAll(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto[]> | void>;

  search(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanSummaryDto[]> | void>;

  getByCode(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto> | void>;

  deleteByDate(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}
