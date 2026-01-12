import { Joi } from 'celebrate';

export const updateOperationPlanSchema = {
  params: Joi.object({
    vvnCode: Joi.number().required(),
  }),
  body: Joi.object({
    dockCode: Joi.string().required(),
    craneCodes: Joi.array().items(Joi.string()).required(),
    staffCodes: Joi.array().items(Joi.number()).required(),
    storageAreaCode: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
    usedAlgorithm: Joi.string().required(),
    creatorUserEmail: Joi.string().email().required(),
    plannedOperations: Joi.array()
      .items(
        Joi.object({
          start: Joi.string().required(),
          end: Joi.string().required(),
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
      )
      .required(),
  }),
};
