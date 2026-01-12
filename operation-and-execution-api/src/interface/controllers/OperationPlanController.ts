import { Inject, Service } from 'typedi';
import IOperationPlanController from './IControllers/IOperationPlanController';
import config from '../../../config';
import IOperationPlanService from '../../use-cases/IServices/IOperationPlanService';
import { NextFunction, Request, Response } from 'express';
import { Result } from '../../shared/logic/Result';
import { CreateOperationPlanCommand } from '../../use-cases/commands/operation-plan-commands/CreateOperationPlanCommand';
import { InterfaceOperationPlanMapper } from '../mappers/InterfaceOperationPlanMapper';
import { OperationPlan } from '../../domain/entities/OperationPlan';
import { OperationPlanResponseDto } from '../dtos/operation-plan/OperationPlanResponseDto';
import { UpdateOperationPlanCommand } from '../../use-cases/commands/operation-plan-commands/UpdateOperationPlanCommand';
import { OperationPlanSummaryDto } from '../dtos/operation-plan/OperationPlanSummaryDto';

import {
  SearchOperationPlansQuery,
  OperationPlanSortBy,
  SortDir,
} from '../dtos/operation-plan/SearchOperationPlansQuery';

@Service()
export default class OperationPlanController implements IOperationPlanController {
  constructor(
    @Inject(config.services.operationPlan.name) private operationPlanServiceInstance: IOperationPlanService,
  ) {}

  async getByCode(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto> | void> {
    try {
      const vvnCode = req.params.vvnCode;

      if (vvnCode === undefined) {
        return res.status(400).json('A vvn code was note provided!');
      }

      const serviceResult = await this.operationPlanServiceInstance.getByCode(Number(vvnCode));

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const updatedOperationPlan = serviceResult.getValue();

      if (updatedOperationPlan instanceof OperationPlan) {
        const updatedOperationPlanResponseDto =
          InterfaceOperationPlanMapper.mapOperationPlanToOperationPlanResponseDto(updatedOperationPlan);

        return res.status(200).json(updatedOperationPlanResponseDto);
      }

      return res.status(400).json('Unexpected error has occured!');
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto> | void> {
    try {
      const vvnCode = req.params.vvnCode;

      if (vvnCode === undefined) {
        return res.status(400).json('A vvn code was note provided!');
      }

      const start = new Date(req.body.start);
      const end = new Date(req.body.end);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({ errors: { message: 'Invalid "start" or "end".' } });
      }

      const updateOperationPlanCommand: UpdateOperationPlanCommand = {
        ...req.body,
        start,
        end,
      };

      const serviceResult = await this.operationPlanServiceInstance.updateOperationPlan(
        Number(vvnCode),
        updateOperationPlanCommand,
      );

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const updatedOperationPlan = serviceResult.getValue();

      if (updatedOperationPlan instanceof OperationPlan) {
        const updatedOperationPlanResponseDto =
          InterfaceOperationPlanMapper.mapOperationPlanToOperationPlanResponseDto(updatedOperationPlan);

        return res.status(200).json(updatedOperationPlanResponseDto);
      }

      return res.status(400).json('Unexpected error has occured!');
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanResponseDto[]> | void> {
    try {
      const serviceResult = await this.operationPlanServiceInstance.getAll();

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const operationPlans = serviceResult.getValue()!;

      const operationPlanGetAllDtos = operationPlans.map((op) =>
        InterfaceOperationPlanMapper.mapOperationPlanToOperationPlanResponseDto(op),
      );

      return res.status(200).json(operationPlanGetAllDtos);
    } catch (error) {
      return next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<Response<OperationPlanSummaryDto[]> | void> {
    try {
      const { from, to, vvnCode, sortBy, sortDir } = req.query;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (from) {
        startDate = new Date(from as string);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ error: 'Invalid start date' });
        }
      }

      if (to) {
        endDate = new Date(to as string);
        if (isNaN(endDate.getTime())) {
          return res.status(400).json({ error: 'Invalid end date' });
        }
      }

      const query: SearchOperationPlansQuery = {};
      if (startDate) query.from = startDate;
      if (startDate) query.to = startDate;
      if (vvnCode !== undefined) query.vvnCode = Number(vvnCode);
      if (sortBy) query.sortBy = sortBy as OperationPlanSortBy;
      if (sortDir) query.sortDir = sortDir as SortDir;

      const serviceResult = await this.operationPlanServiceInstance.search(query);

      if (serviceResult.isFailure) {
        return res.status(400).json({ errors: { message: serviceResult.error } });
      }

      const operationPlans = serviceResult.getValue()!;
      const dtos = operationPlans.map((op) =>
        InterfaceOperationPlanMapper.mapOperationPlanToOperationPlanResponseDto(op),
      );

      return res.status(200).json(dtos);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response<string> | void> {
    try {
      const start = new Date(req.body.start);
      const end = new Date(req.body.end);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({ errors: { message: 'Invalid "start" or "end".' } });
      }

      const createOperationPlanCommand: CreateOperationPlanCommand = {
        ...req.body,
        start,
        end,
      };

      const serviceResult = (await this.operationPlanServiceInstance.createOperationPlan(
        createOperationPlanCommand,
      )) as Result<string>;

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const operationPlanCode = serviceResult.getValue();

      return res.status(201).json(operationPlanCode);
    } catch (e) {
      return next(e);
    }
  }

  public async deleteByDate(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const dateString = req.params.date as string;

      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const result = await this.operationPlanServiceInstance.deleteByDate(dateObj);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(204).send();
    } catch (e) {
      return next(e);
    }
  }
}
