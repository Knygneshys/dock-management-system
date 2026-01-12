import { Joi } from 'celebrate';

export const updateIncidentTypeSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    severity: Joi.string().required(),
    parentIncidentTypeCode: Joi.string().allow(null),
  }),
};
