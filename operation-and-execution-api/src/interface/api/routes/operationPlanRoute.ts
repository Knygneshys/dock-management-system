import Container from 'typedi';
import { Router } from 'express';
import { updateOperationPlanSchema } from '../route-validation-schemas/operation-plan/updateOperationPlanSchema';
import { createOperationPlanSchema } from '../route-validation-schemas/operation-plan/createOperationPlanSchema';
import { celebrate, Joi } from 'celebrate';
import IOperationPlanController from '../../controllers/IControllers/IOperationPlanController';
import config from '../../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/operation-plan', route);

  const ctrl = Container.get(config.controllers.operationPlan.name) as IOperationPlanController;

  route.post('', celebrate(createOperationPlanSchema), (req, res, next) => ctrl.create(req, res, next));

  route.put('/:vvnCode', celebrate(updateOperationPlanSchema), (req, res, next) => ctrl.update(req, res, next));

  route.get(
    '/:vvnCode',
    celebrate({
      params: Joi.object({
        vvnCode: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.getByCode(req, res, next),
  );

  // Search endpoint (default)
  route.get(
    '',
    celebrate({
      query: Joi.object({
        from: Joi.date().iso().optional(),
        to: Joi.date().iso().optional(),
        vvnCode: Joi.number().optional(),
        sortBy: Joi.string().valid('start', 'end', 'vvnCode', 'createdAt').optional(),
        sortDir: Joi.string().valid('asc', 'desc').optional(),
      }),
    }),
    (req, res, next) => ctrl.search(req, res, next),
  );

  // Keep old getAll explicitly
  route.get('/all', (req, res, next) => ctrl.getAll(req, res, next));

  route.delete(
    '/by-date/:date',
    celebrate({
      params: Joi.object({
        date: Joi.date().iso().required(),
      }),
    }),
    (req, res, next) => ctrl.deleteByDate(req, res, next),
  );
};
