import { Router } from 'express';
import Container from 'typedi';
import config from '../../../../config';
import ICompTaskCategoryController from '../../controllers/IControllers/ICompTaskCategoryController';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/complementary-task-categories', route);

  const ctrl = Container.get(config.controllers.compTaskCategory.name) as ICompTaskCategoryController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        defaultDelay: Joi.object({
          hour: Joi.number().min(0).max(9999).required(),
          minute: Joi.number().min(0).max(59).required(),
        })
          .optional()
          .unknown(false),
      }),
    }),
    (req, res, next) => ctrl.createCtc(req, res, next),
  );

  route.get(
    '',
    celebrate({
      query: Joi.object({
        name: Joi.string().optional(),
      }),
    }),
    (req, res, next) => ctrl.search(req, res, next),
  );
};
