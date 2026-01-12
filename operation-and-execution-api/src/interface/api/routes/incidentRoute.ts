import { Router } from 'express';
import Container from 'typedi';
import config from '../../../../config';
import IIncidentController from '../../controllers/IControllers/IIncidentController';
import { celebrate, Joi } from 'celebrate';
import { SeverityClassification } from '../../../domain/enums/severityClassification';
import { IncidentStatus } from '../../../domain/enums/incidentStatus';

const route = Router();

export default (app: Router) => {
  app.use('/incidents', route);

  const ctrl = Container.get(config.controllers.incident.name) as IIncidentController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        typeCode: Joi.string().required(),
        description: Joi.string().required(),
        startISO: Joi.string().isoDate().required(),
        endISO: Joi.string().isoDate().optional(),
        responsibleUserEmail: Joi.string().email().required(),
        afectedVVECodes: Joi.array().items(Joi.number()).optional().default([]),
      }),
    }),
    (req, res, next) => ctrl.createIncident(req, res, next),
  );

  route.get(
    '',
    celebrate({
      query: Joi.object({
        vveCode: Joi.number().optional(),
        startDate: Joi.string().isoDate().optional(),
        endDate: Joi.string().isoDate().optional(),
        severity: Joi.string()
          .valid(...Object.values(SeverityClassification))
          .optional(),
        status: Joi.string()
          .valid(...Object.values(IncidentStatus))
          .optional(),
      }),
    }),
    (req, res, next) => ctrl.searchIncidents(req, res, next),
  );

  route.post(
    '/associate-vve',
    celebrate({
      body: Joi.object({
        incidentCode: Joi.string().required(),
        vveCode: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.associateVVEtoIncident(req, res, next),
  );

  route.delete(
    '/detach-vve',
    celebrate({
      body: Joi.object({
        incidentCode: Joi.string().required(),
        vveCode: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.detachVVEfromIncident(req, res, next),
  );

  route.patch(
    '/:incidentCode/resolve',
    celebrate({
      params: Joi.object({
        incidentCode: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.resolveIncident(req, res, next),
  );
};
