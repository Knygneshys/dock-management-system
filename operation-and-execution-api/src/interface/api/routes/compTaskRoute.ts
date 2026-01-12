import { Router } from 'express';
import Container from 'typedi';
import config from '../../../../config';
import ICompTaskController from '../../controllers/IControllers/ICompTaskController';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {

  app.use('/complementary-tasks', route);

  const ctrl = Container.get(config.controllers.compTask.name) as ICompTaskController;

  route.post(
  '',
  celebrate({
    body: Joi.object({
      categoryCode: Joi.string().required(),
      vveCode: Joi.number().required(),
      team: Joi.string().required(),
      status: Joi.string().valid('ongoing', 'scheduled', 'completed').required(),
      start: Joi.date().iso().required(),
      end: Joi.date().iso().optional().allow(null),
      impactOnOperations: Joi.boolean().required(),
    }),
  }),
  (req, res, next) => ctrl.createCompTask(req, res, next),
);

  route.get(
    '',
    celebrate({
      query: Joi.object({
        start: Joi.date().optional(),
        end: Joi.date().optional(),
        status: Joi.string().valid('ongoing', 'completed', 'scheduled').optional(),
      }),
    }),
    (req, res, next) => {
      if (req.query.start || req.query.end || req.query.status) {
        return ctrl.search(req, res, next);
      }
      return ctrl.getAllCompTasks(req, res, next);
    },
  );

  route.get(
  '/vve/:vvnCode',
  celebrate({
    params: Joi.object({
      vvnCode: Joi.number().required(),
    }),
  }),
  (req, res, next) => ctrl.getTasksByVVE(req, res, next),
);

route.put(
  '/:code',
  celebrate({
    params: Joi.object({
      code: Joi.string().required(),
    }),
    body: Joi.object({
      team: Joi.string().optional(),
      status: Joi.string().valid('ongoing', 'scheduled', 'completed').optional(),
      end: Joi.date().iso().optional().allow(null),
    }),
  }),
  (req, res, next) => ctrl.updateCompTask(req, res, next),
);

  route.get(
    '/:code',
    celebrate({
      params: Joi.object({
        code: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.getCompTaskByCode(req, res, next),
  );
};