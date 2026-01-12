import { Router } from 'express';
import Container from 'typedi';
import config from '../../../../config';
import IVVEController from '../../controllers/IControllers/IVVEController';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/vves', route);

  const ctrl = Container.get(config.controllers.vve.name) as IVVEController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        vvnCode: Joi.number().required(),
        vesselImo: Joi.string().required(),
        arrivalTime: Joi.date().iso().required(),
        creatorUserEmail: Joi.string().required(),
        dockCode: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createVVE(req, res, next),
  );

  route.get('', (req, res, next) => ctrl.getAllVVE(req, res, next));

  route.get(
    '/search',
    celebrate({
      query: Joi.object({
        start: Joi.date().optional(),
        end: Joi.date().optional(),
        vesselImo: Joi.string().optional(),
        status: Joi.string().valid('InProgress', 'Concluded', 'Waiting', 'Departing').optional(),
      }),
    }),
    (req, res, next) => ctrl.searchVVE(req, res, next),
  );

  route.get(
    '/get-executed-operations/:code',
    celebrate({
      params: Joi.object({
        code: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.getExecutedOperations(req, res, next),
  );

  route.put(
    '/:code',
    celebrate({
      params: Joi.object({
        code: Joi.number().required(),
      }),
      body: Joi.object({
        dockCode: Joi.string().optional(),
        arrivalTime: Joi.date().iso().optional(),
      }).min(1),
    }),
    (req, res, next) => ctrl.updateVVE(req, res, next),
  );

  route.put(
    '/add-executed-operation/:code',
    celebrate({
      params: Joi.object({
        code: Joi.number().required(),
      }),
      body: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required(),
        from: Joi.object({
          bay: Joi.number().required(),
          row: Joi.number().required(),
          tier: Joi.number().required(),
        }).required(),
        to: Joi.object({
          bay: Joi.number().required(),
          row: Joi.number().required(),
          tier: Joi.number().required(),
        }).required(),
        containerId: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.addExecutedOperations(req, res, next),
  );
};
