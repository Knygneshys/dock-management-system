import { Router } from 'express';
import vve from './routes/vveRoute';
import incident from './routes/incidentRoute';
import operationPlanRoute from './routes/operationPlanRoute';
import compTaskCategory from './routes/compTaskCategoryRoute';
import compTaskRoute from './routes/compTaskRoute';
import incidentTypeRoute from './routes/incidentTypeRoute';

export default () => {
  const app = Router();

  // route(app) [for each one]
  vve(app);
  incident(app);
  operationPlanRoute(app);
  compTaskCategory(app);
  compTaskRoute(app);
  incidentTypeRoute(app);

  return app;
};
