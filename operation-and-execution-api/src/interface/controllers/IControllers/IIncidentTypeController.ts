import { NextFunction, Request, Response } from 'express';
import { IncidentTypeResponseDto } from '../../dtos/incident-type/IncidentTypeResponseDto';

export default interface IIncidentTypeController {
  create(req: Request, res: Response, next: NextFunction): Promise<Response<string> | void>;

  update(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto> | void>;

  search(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto[]> | void>;

  findByCode(req: Request, res: Response, next: NextFunction): Promise<Response<IncidentTypeResponseDto> | void>;
}
