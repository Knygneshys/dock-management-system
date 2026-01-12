import { Router } from 'express';
import Container from 'typedi';
import config from '../../../../config';
import IIncidentTypeController from '../../controllers/IControllers/IIncidentTypeController';
import { celebrate, Joi } from 'celebrate';
import { createIncidentTypeSchema } from '../route-validation-schemas/incident-type/createIncidentTypeSchema';
import { updateIncidentTypeSchema } from '../route-validation-schemas/incident-type/updateIncidentTypeSchema';

const route = Router();

export default (app: Router) => {
  app.use('/incident-type', route);

  const ctrl = Container.get(config.controllers.incidentType.name) as IIncidentTypeController;

  route.post('', celebrate(createIncidentTypeSchema), (req, res, next) => ctrl.create(req, res, next));

  route.put('/:code', celebrate(updateIncidentTypeSchema), (req, res, next) => ctrl.update(req, res, next));

  route.get('', (req, res, next) => ctrl.search(req, res, next));

  route.get(
    '/:code',
    celebrate({
      params: Joi.object({
        code: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.findByCode(req, res, next),
  );
};
