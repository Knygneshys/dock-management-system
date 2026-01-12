import { Joi } from 'celebrate';

export const createIncidentTypeSchema = {
  body: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    severity: Joi.string().required(),
    parentIncidentTypeCode: Joi.string().allow(null),
  }),
};
