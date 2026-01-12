import { Request, Response, NextFunction } from 'express';
import IVVEController from './IControllers/IVVEController';
import { Inject, Service } from 'typedi';
import config from '../../../config';
import IVVEService from '../../use-cases/IServices/IVVEService';
import { IVVEDTO } from '../../use-cases/dto/vve-dtos/IVVEDTO';
import { Result } from '../../shared/logic/Result';
import { VesselImo } from '../../domain/object-values/vesselImo';
import { VVEStatus } from '../../domain/enums/vveStatus';
import { IUpdateVVEDTO } from '../../use-cases/dto/vve-dtos/IUpdateVVEDTO';
import { CreateExecutedOperationCommand } from '../../use-cases/commands/executed-operation/CreateExecutedOperationCommand';
import { InterfaceExecutedOperationMapper } from '../mappers/InterfaceExecutedOperationMapper';

@Service()
export default class VVEController implements IVVEController {
  constructor(@Inject(config.services.vve.name) private vveServiceInstance: IVVEService) {}

  public async getExecutedOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;

      if (!code) {
        return res.status(400).send('No code was specified!');
      }

      const executedOperationsOrError = await this.vveServiceInstance.getExecutedOperations(Number(code));

      if (executedOperationsOrError.isFailure) {
        return res.status(402).send();
      }

      const executedOperationResponseDtos = executedOperationsOrError
        .getValue()!
        .map((op) => InterfaceExecutedOperationMapper.mapExecutedOperationToExecutedOperationResponseDto(op));

      return res.json(executedOperationResponseDtos).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async addExecutedOperations(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.params.code;

      if (!code) {
        return res.status(400).send('No code was specified!');
      }

      const executedOperation = req.body as CreateExecutedOperationCommand;

      const vveOrError = await this.vveServiceInstance.addExecutedOperation(Number(code), executedOperation);

      if (vveOrError.isFailure) {
        return res.status(402).send();
      }

      const vveDTO = vveOrError.getValue();
      return res.json(vveDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async createVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const vveOrError = (await this.vveServiceInstance.createVve(req.body as IVVEDTO)) as Result<IVVEDTO>;

      if (vveOrError.isFailure) {
        return res.status(402).send();
      }

      const vveDTO = vveOrError.getValue();
      return res.json(vveDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async getAllVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const vvesOrError = (await this.vveServiceInstance.getAllVves()) as Result<IVVEDTO[]>;

      if (vvesOrError.isFailure) {
        return res.status(402).send();
      }

      const vveDTOs = vvesOrError.getValue();
      return res.json(vveDTOs).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async searchVVE(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { start, end, vesselImo, status } = req.query;

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

      let vesselImoVO: VesselImo | undefined;
      if (vesselImo) {
        const vesselImoResult = VesselImo.create(vesselImo as string);
        if (vesselImoResult.isFailure) {
          return res.status(400).json({ error: 'Invalid vessel IMO format' });
        }
        vesselImoVO = vesselImoResult.getValue()!;
      }

      let statusEnum: VVEStatus | undefined;
      if (typeof status === 'string') {
        if (!Object.values(VVEStatus).includes(status as VVEStatus)) {
          return res.status(400).json({ error: 'Invalid status value' });
        }
        statusEnum = status as VVEStatus;
      }

      const result = await this.vveServiceInstance.search(startDate, endDate, vesselImoVO, statusEnum);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }

  public async updateVVE(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: IUpdateVVEDTO = {
        code: Number(req.params.code),
        dockCode: req.body.dockCode,
        arrivalTime: req.body.arrivalTime,
      };
      const result = await this.vveServiceInstance.updateVVE(dto);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }
}
