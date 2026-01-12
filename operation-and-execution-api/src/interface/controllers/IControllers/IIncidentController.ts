import { NextFunction, Request, Response } from 'express';

export default interface IIncidentController {
  createIncident(req: Request, res: Response, next: NextFunction): any;
  searchIncidents(req: Request, res: Response, next: NextFunction): any;
  associateVVEtoIncident(req: Request, res: Response, next: NextFunction): any;
  detachVVEfromIncident(req: Request, res: Response, next: NextFunction): any;
  resolveIncident(req: Request, res: Response, next: NextFunction): any;
}
