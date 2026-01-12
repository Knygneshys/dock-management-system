/* eslint-disable */
import { NextFunction, Request, Response } from 'express';

export default interface IVVEController {
  createVVE(req: Request, res: Response, next: NextFunction): any;
  getAllVVE(req: Request, res: Response, next: NextFunction): any;
  searchVVE(req: Request, res: Response, next: NextFunction): any;
  updateVVE(req: Request, res: Response, next: NextFunction): any;
  addExecutedOperations(req: Request, res: Response, next: NextFunction): any;
  getExecutedOperations(req: Request, res: Response, next: NextFunction): any;
}
