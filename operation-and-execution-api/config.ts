import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT || '4000', 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  //change according to our OEM controllers
  controllers: {
    vve: {
      name: 'VVEController' as const,
      path: '../interface/controllers/vveController',
    },
    incident: {
      name: 'IncidentContoller' as const,
      path: '../interface/controllers/incidentController',
    },
    operationPlan: {
      name: 'OperationPlanController' as const,
      path: '../interface/controllers/OperationPlanController',
    },
    compTaskCategory: {
      name: 'CompTaskCategoryController' as const,
      path: '../interface/controllers/compTaskCategoryController',
    },
    compTask: {
      name: 'CompTaskController' as const,
      path: '../interface/controllers/compTaskController',
    },
    incidentType: {
      name: 'IncidentType' as const,
      path: '../interface/controllers/IncidentTypeController',
    },
  },

  //change according to our OEM repos
  repos: {
    vve: {
      name: 'VVERepo' as const,
      path: '../infrastructure/mongodb/repos/vveRepo',
    },
    incident: {
      name: 'IncidentRepo' as const,
      path: '../infrastructure/mongodb/repos/incidentRepo',
    },
    visitIncident: {
      name: 'VisitIncidentRepo' as const,
      path: '../infrastructure/mongodb/repos/visitIncidentRepo',
    },
    operationPlan: {
      name: 'OperationPlanRepo' as const,
      path: '../infrastructure/mongodb/repos/OperationPlanRepo',
    },
    compTaskCategory: {
      name: 'CompTaskCategoryRepo' as const,
      path: '../infrastructure/mongodb/repos/compTaskCategoryRepo',
    },
    compTask: {
      name: 'CompTaskRepo' as const,
      path: '../infrastructure/mongodb/repos/compTaskRepo',
    },
    incidentType: {
      name: 'IncidentTypeRepo' as const,
      path: '../infrastructure/mongodb/repos/IncidentTypeRepo',
    },
  },

  //change according to our OEM services
  services: {
    vve: {
      name: 'VVEService' as const,
      path: '../use-cases/services/vveService',
    },
    incident: {
      name: 'IncidentService' as const,
      path: '../use-cases/services/incidentService',
    },
    operationPlan: {
      name: 'OperationPlanService' as const,
      path: '../use-cases/services/OperationPlanService',
    },
    compTaskCategory: {
      name: 'CompTaskCategoryService' as const,
      path: '../use-cases/services/compTaskCategoryService',
    },
    compTask: {
      name: 'CompTaskService' as const,
      path: '../use-cases/services/compTaskService',
    },
    incidentType: {
      name: 'IncidentTypeService' as const,
      path: '../use-cases/services/incidentTypeService',
    },
  },
};
