import { Inject, Service } from 'typedi';
import config from '../../../config';
import ICompTaskService from '../../use-cases/IServices/ICompTaskService';
import { Request, Response, NextFunction } from 'express';
import { ICompTaskDTO } from '../../use-cases/dto/ICompTaskDTO';
import { ICompTaskUpdateDTO } from '../../use-cases/dto/ICompTaskUpdateDTO';
import { compTaskStatus } from '../../domain/enums/compTaskStatus';
import { VVNCode } from '../../domain/object-values/vvnCode';
import { GenericCode } from '../../domain/object-values/genericCode';
import ICompTaskController from './IControllers/ICompTaskController';

@Service()
export default class CompTaskController implements ICompTaskController {
  constructor(
    @Inject(config.services.compTask.name)
    private ctService: ICompTaskService
  ) {}

  public async createCompTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    
    const result = await this.ctService.create(req.body as ICompTaskDTO);

    if (result.isFailure) {
      return res.status(400).json({ error: result.errorValue() });
    }

    return res.status(201).json(result.getValue());
  } catch (e) {
    console.error('Exception caught:', e);
    return next(e);
  }
}

  public async getAllCompTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const result = await this.ctService.getAll();

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }


  public async search(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { start, end, status } = req.query;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (start) {
        startDate = new Date(start as string);
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ error: 'Invalid start date' });
        }
      }

      if (end) {
        endDate = new Date(end as string);
        if (isNaN(endDate.getTime())) {
          return res.status(400).json({ error: 'Invalid end date' });
        }
      }

      let statusEnum: compTaskStatus | undefined;

      if (typeof status === 'string') {
      if (!Object.values(compTaskStatus).includes(status as compTaskStatus)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
        statusEnum = status as compTaskStatus;
      }


      const result = await this.ctService.search(
        startDate,
        endDate,
        statusEnum
      );

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }

  public async getTasksByVVE(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const vvnCodeParam = Number(req.params.vvnCode);

      if (!vvnCodeParam) {
        return res.status(400).json({ error: 'VVN code is required' });
      }

      if (isNaN(vvnCodeParam)) {
      return res.status(400).json({ error: 'VVN code must be a number' });
      }

      const vvnCodeResult = VVNCode.create(vvnCodeParam);

      if (vvnCodeResult.isFailure) {
        return res.status(400).json({ error: vvnCodeResult.errorValue() });
      }

      const result = await this.ctService.getAllByVve(
        vvnCodeResult.getValue()!
      );

      if (result.isFailure) {
        return res.status(404).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }


  public async updateCompTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    
    const { code } = req.params;
    
    const codeResult = GenericCode.create(code!);
    if (codeResult.isFailure) {
      return res.status(400).json({ error: codeResult.errorValue() });
    }

    const result = await this.ctService.update(req.body as ICompTaskUpdateDTO, codeResult.getValue()!);

    if (result.isFailure) {
      return res.status(400).json({ error: result.errorValue() });
    }

    return res.status(204).send();
  } catch (e) {
    console.error('Exception caught:', e);
    return next(e);
  }
}

  public async getCompTaskByCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { code } = req.params;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const codeResult = GenericCode.create(code);
    if (codeResult.isFailure) {
      return res.status(400).json({ error: codeResult.errorValue() });
    }
    
    const task = await this.ctService.getByCode(codeResult.getValue()!);
    
    if (task.isFailure) {
      return res.status(404).json({ error: task.errorValue() });
    }
    
    return res.status(200).json(task.getValue());
  } catch (e) {
    return next(e);
  }
}
}
