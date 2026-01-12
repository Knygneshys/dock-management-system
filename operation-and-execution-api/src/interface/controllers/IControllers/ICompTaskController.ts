import { Request, Response, NextFunction } from "express";
export default interface ICompTaskController {
    createCompTask(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getAllCompTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    search(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getTasksByVVE(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    updateCompTask(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    getCompTaskByCode(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}