import { Inject, Service } from 'typedi';
import IIncidentController from './IControllers/IIncidentController';
import config from '../../../config';
import IIncidentService from '../../use-cases/IServices/IIncidentService';
import { Request, Response, NextFunction } from 'express';
import { IIncidentDTO } from '../../use-cases/dto/incident-dtos/IIncidentDTO';
import { Result } from '../../shared/logic/Result';
import { CreateIncidentCommand } from '../../use-cases/commands/incident/CreateIncidentCommand';

@Service()
export default class IncidentController implements IIncidentController {
  constructor(@Inject(config.services.incident.name) private incidentServiceInstance: IIncidentService) {}

  public async createIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const incidentOrError = (await this.incidentServiceInstance.createIncident(
        req.body as CreateIncidentCommand,
      )) as Result<IIncidentDTO>;

      if (incidentOrError.isFailure) {
        return res.status(402).send();
      }

      const incidentDTO = incidentOrError.getValue();
      return res.json(incidentDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async searchIncidents(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      const result = await this.incidentServiceInstance.searchIncidents(query);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }

  public async associateVVEtoIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { vveCode, incidentCode } = req.body;

      const result = await this.incidentServiceInstance.associateVVEtoIncident(Number(vveCode), incidentCode);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return next(e);
    }
  }

  public async detachVVEfromIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { vveCode, incidentCode } = req.body;

      const result = await this.incidentServiceInstance.detachVVEfromIncident(Number(vveCode), incidentCode);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json({ success: true });
    } catch (e) {
      return next(e);
    }
  }

  public async resolveIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { incidentCode } = req.params;

      if (!incidentCode) {
        return res.status(400).json({ error: 'incidentCode is required' });
      }

      const result = await this.incidentServiceInstance.resolveIncident(incidentCode);

      if (result.isFailure) {
        return res.status(400).json({ error: result.errorValue() });
      }

      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }
}
