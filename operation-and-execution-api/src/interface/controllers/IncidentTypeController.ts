import { Inject, Service } from 'typedi';
import IIncidentTypeController from './IControllers/IIncidentTypeController';
import { Request, Response, NextFunction } from 'express';
import config from '../../../config';
import IIncidentTypeService from '../../use-cases/IServices/IIncidentTypeService';
import { CreateIncidentTypeCommand } from '../../use-cases/commands/incident-type/CreateIncidentTypeCommand';
import { InterfaceIncidentTypeMapper } from '../mappers/InterfaceIncidentTypeMapper';
import { IncidentTypeResponseDto } from '../dtos/incident-type/IncidentTypeResponseDto';
import { UpdateIncidentTypeCommand } from '../../use-cases/commands/incident-type/UpdateIncidentTypeCommand';
import { IncidentType } from '../../domain/entities/incidentType';
import { SearchIncidentTypeQuery } from '../../use-cases/queries/incident-type/SearchIncidentTypeQuery';
import { SeverityClassification } from '../../domain/enums/severityClassification';

@Service()
export default class IncidentTypeController implements IIncidentTypeController {
  constructor(@Inject(config.services.incidentType.name) private incidentTypeServiceInstance: IIncidentTypeService) {}

  async findByCode(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto> | void> {
    try {
      const code = req.params.code;

      if (code === undefined) {
        return res.status(400).json('An incident type code was not provided!');
      }

      const serviceResult = await this.incidentTypeServiceInstance.getByCode(code);

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const incidentType = serviceResult.getValue();

      if (incidentType instanceof IncidentType) {
        const updatedIncidentTypeResponseDto =
          InterfaceIncidentTypeMapper.mapIncidentTypeToIncidentTypeResponseDto(incidentType);

        return res.status(200).json(updatedIncidentTypeResponseDto);
      }

      return res.status(400).json('Unexpected error has occured!');
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto> | void> {
    try {
      const code = req.params.code;

      if (code === undefined) {
        return res.status(400).json('An incident type code was not provided!');
      }

      const updateIncidentTypeCommand: UpdateIncidentTypeCommand = req.body;

      const serviceResult = await this.incidentTypeServiceInstance.update(code, updateIncidentTypeCommand);

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const updatedIncidentType = serviceResult.getValue();

      if (updatedIncidentType instanceof IncidentType) {
        const updatedIncidentTypeResponseDto =
          InterfaceIncidentTypeMapper.mapIncidentTypeToIncidentTypeResponseDto(updatedIncidentType);

        return res.status(200).json(updatedIncidentTypeResponseDto);
      }

      return res.status(400).json('Unexpected error has occured!');
    } catch (e) {
      return next(e);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto[]> | void> {
    try {
      const { code, parentIncidentTypeCode, description, severity } = req.query;

      const queryIsNull =
        code === undefined &&
        parentIncidentTypeCode === undefined &&
        description === undefined &&
        severity === undefined;

      const query: SearchIncidentTypeQuery = {};

      if (code) {
        query.code = code.toString();
      }

      if (parentIncidentTypeCode) {
        query.parentIncidentTypeCode = parentIncidentTypeCode.toString();
      }

      if (description) {
        query.description = description.toString();
      }

      if (severity) {
        query.severity = severity as SeverityClassification;
      }

      const serviceResult = queryIsNull
        ? await this.incidentTypeServiceInstance.getAll()
        : await this.incidentTypeServiceInstance.search(query);

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const incidentType = serviceResult.getValue()!;

      const incidentPlanResponseDtos = incidentType.map((type) => {
        return InterfaceIncidentTypeMapper.mapIncidentTypeToIncidentTypeResponseDto(type);
      });

      return res.status(200).json(incidentPlanResponseDtos);
    } catch (error) {
      return next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<Response<string> | void> {
    try {
      const command = req.body as CreateIncidentTypeCommand;

      const serviceResult = await this.incidentTypeServiceInstance.create(command);

      if (serviceResult.isFailure) {
        return res.status(400).json(serviceResult.error);
      }

      const incidentTypeCode = serviceResult.getValue();

      return res.status(201).json(incidentTypeCode);
    } catch (e) {
      return next(e);
    }
  }
}
