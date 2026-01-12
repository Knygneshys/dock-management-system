import express from 'express';
import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import { Db } from 'mongodb';
import Logger from './logger';

import config from '../../config';
import {
  incidentTypeSchemaDependencyInjection,
  operationPlanSchemaDependencyInjection,
} from '../shared/domain/constants/dependency-injection-strings';

export default async ({ expressApp }: { expressApp: express.Application }) => {
  const mongoConnection: Db = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  /////// SCHEMAS ///////

  const operationPlanSchema = {
    name: operationPlanSchemaDependencyInjection,
    schema: '../infrastructure/mongodb/persistence/schemas/OperationPlanSchema',
  };

  const vveSchema = {
    name: 'vveSchema',
    schema: '../infrastructure/mongodb/persistence/schemas/vveSchema',
  };

  const incidentSchema = {
    name: 'incidentSchema',
    schema: '../infrastructure/mongodb/persistence/schemas/incidentSchema',
  };

  const visitIncidentSchema = {
    name: 'visitIncidentSchema',
    schema: '../infrastructure/mongodb/persistence/schemas/visitIncidentSchema',
  };

  const compTaskCategorySchema = {
    name: 'compTaskCategorySchema',
    schema: '../infrastructure/mongodb/persistence/schemas/compTaskCategorySchema',
  };

  const compTaskSchema = {
    name: 'compTaskSchema',
    schema: '../infrastructure/mongodb/persistence/schemas/compTaskSchema',
  };

  const incidentTypeSchema = {
    name: incidentTypeSchemaDependencyInjection,
    schema: '../infrastructure/mongodb/persistence/schemas/IncidentTypeSchema',
  };

  /////// CONTROLLERS ///////

  const operationPlanController = {
    name: config.controllers.operationPlan.name,
    path: config.controllers.operationPlan.path,
  };

  const vveController = {
    name: config.controllers.vve.name,
    path: config.controllers.vve.path,
  };

  const incidentController = {
    name: config.controllers.incident.name,
    path: config.controllers.incident.path,
  };

  const compTaskCategoryController = {
    name: config.controllers.compTaskCategory.name,
    path: config.controllers.compTaskCategory.path,
  };

  const compTaskController = {
    name: config.controllers.compTask.name,
    path: config.controllers.compTask.path,
  };

  const incidentTypeController = {
    name: config.controllers.incidentType.name,
    path: config.controllers.incidentType.path,
  };

  /////// REPOS ///////

  const operationPlanRepo = {
    name: config.repos.operationPlan.name,
    path: config.repos.operationPlan.path,
  };

  const vveRepo = {
    name: config.repos.vve.name,
    path: config.repos.vve.path,
  };

  const incidentRepo = {
    name: config.repos.incident.name,
    path: config.repos.incident.path,
  };

  const visitIncidentRepo = {
    name: config.repos.visitIncident.name,
    path: config.repos.visitIncident.path,
  };

  const compTaskCategoryRepo = {
    name: config.repos.compTaskCategory.name,
    path: config.repos.compTaskCategory.path,
  };

  const compTaskRepo = {
    name: config.repos.compTask.name,
    path: config.repos.compTask.path,
  };

  const incidentTypeRepo = {
    name: config.repos.incidentType.name,
    path: config.repos.incidentType.path,
  };

  /////// SERVICES ///////

  const operationPlanService = {
    name: config.services.operationPlan.name,
    path: config.services.operationPlan.path,
  };

  const vveService = {
    name: config.services.vve.name,
    path: config.services.vve.path,
  };

  const incidentService = {
    name: config.services.incident.name,
    path: config.services.incident.path,
  };

  const compTaskCategoryService = {
    name: config.services.compTaskCategory.name,
    path: config.services.compTaskCategory.path,
  };

  const compTaskService = {
    name: config.services.compTask.name,
    path: config.services.compTask.path,
  };

  const incidentTypeService = {
    name: config.services.incidentType.name,
    path: config.services.incidentType.path,
  };

  dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      vveSchema,
      incidentSchema,
      visitIncidentSchema,
      operationPlanSchema,
      compTaskCategorySchema,
      compTaskSchema,
      incidentTypeSchema,
    ],
    controllers: [
      vveController,
      incidentController,
      operationPlanController,
      compTaskCategoryController,
      compTaskController,
      incidentTypeController,
    ],
    repos: [
      incidentTypeRepo,
      vveRepo,
      visitIncidentRepo,
      incidentRepo,
      operationPlanRepo,
      compTaskCategoryRepo,
      compTaskRepo,
    ],
    services: [
      vveService,
      incidentService,
      operationPlanService,
      compTaskCategoryService,
      compTaskService,
      incidentTypeService,
    ],
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
