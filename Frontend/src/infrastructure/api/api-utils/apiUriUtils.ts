export const vesselTypeUris = {
  GET_ALL: "VesselTypes",
  GET_BY_ID: "VesselTypes",
  CREATE: "VesselTypes",
  UPDATE: "VesselTypes",
  SEARCH: "VesselTypes/search"
};

export const vesselUris = {
  SEARCH: "Vessels/search",
  GET_ALL: "Vessels",
  CREATE: "Vessels",
  GET_BY_IMO: "Vessels",
  UPDATE: "Vessels"
};

export const companyUris = {
  GET_ALL: "Companies"
};

export const qualificationUris = {
  GET_ALL: "Qualifications",
  GET_BY_ID: "Qualifications",
  CREATE: "Qualifications",
  UPDATE: "Qualifications",
  SEARCH: "Qualifications/search"
};

export const resourceUris = {
  create: "Resources",
  search: "Resources",
  getByCode: (code: string) => `Resources/${code}`,
  reactivate: (code: string) => `Resources/${code}/reactivate`,
  deactivate: (code: string) => `Resources/${code}/deactivate`
};

export const staffMemberUris = {
  GET_ALL: "StaffMembers",
  GET_BY_ID: "StaffMembers",
  CREATE: "StaffMembers",
  UPDATE: "StaffMembers",
  SEARCH: "StaffMembers/search",
  DEACTIVATE: (mNumber: number) => `StaffMembers/${mNumber}/deactivate`,
  ACTIVATE: (mNumber: number) => `StaffMembers/${mNumber}/activate`,
  ADD_OPERATIONAL_WINDOW: (mNumber: number) => `StaffMembers/${mNumber}/operational-window`,
  DELETE_OPERATIONAL_WINDOW: (mNumber: number, operationalWindowCode: string) =>
    `StaffMembers/${mNumber}/operational-window/${operationalWindowCode}`,
  UPDATE_OPERATIONAL_WINDOW: (mNumber: number, operationalWindowCode: string) =>
    `StaffMembers/${mNumber}/operational-window/${operationalWindowCode}`
};

export const sarUris = {
  getAll: "ShippingAgentRepresentatives",
  create: "ShippingAgentRepresentatives",
  getAllSarVvns: "ShippingAgentRepresentatives/notifications"
};

export const vvnUris = {
  createMaintenece: "VesselVisitNotifications/maintence-vvn",
  createLoad: "VesselVisitNotifications/load-vvn",
  createUnload: "VesselVisitNotifications/unload-vvn",
  createFull: "VesselVisitNotifications/full-vvn",
  getByCode: (code: number) => `VesselVisitNotifications/${code}`,
  updateByCode: (code: number) => `VesselVisitNotifications/${code}`,
  getAll: "VesselVisitNotifications",
  sendBack: (code: number) => `VesselVisitNotifications/${code}/send-back`,
  reject: (code: number) => `VesselVisitNotifications/${code}/reject`,
  aprove: (code: number) => `VesselVisitNotifications/${code}/aprove`,
  addCrewManifest: (code: number) => `VesselVisitNotifications/${code}/crew-manifest`,
  getApproved: "VesselVisitNotifications/not-planned"
};

export const shiftUris = {
  getAll: "shifts",
  create: (mNumber: number) => `StaffMembers/${mNumber}/shift`
};

export const vesselVisitsUris = {
  getAll: "VesselVisits"
};

export const stockItemsUris = {
  getAll: "StockItems"
};

export const userUris = {
  CREATE: "/users",
  ASSIGN_ROLE: "/users/assign-role",
  VALIDATE_TOKEN: "/users/validate-token",
  COMPLETE_ACTIVATION: "/users/complete-activation",
  GET_CURRENT: "users/me",
  GET_ALL: "/users",
  GET_ROLE: "/users/role",
  APPROVE_PRIVACY_POLICY: "users/approve-privacy-policy"
};

export const dockRecordUris = {
  GET_ALL: "DockRecords",
  GET_BY_ID: "DockRecords",
  CREATE: "DockRecords",
  UPDATE: "DockRecords",
  SEARCH: "DockRecords/search"
};

export const storageAreasUris = {
  GET_ALL: "StorageAreas",
  GET_BY_ID: "StorageAreas",
  CREATE: "StorageAreas",
  UPDATE: "StorageAreas",
  SEARCH: "StorageAreas/search"
};

export const planningUris = {
  GET_DAILY: "Planning/daily",
  GET_REBALANCE_COMPARISON: "planning/rebalance-comparison"
};

export const operationPlanUris = {
  search: "OperationPlan",
  create: "OperationPlan",
  update: (vvnCode: number) => `OperationPlan/${vvnCode}`,
  DELETE_BY_DATE: (date: string) => `OperationPlan/by-date/${date}`,
  FIND_BY_CODE: (vvnCode: number) => `OperationPlan/${vvnCode}`
};

export const compTaskUris = {
  GET_ALL: "ComplementaryTask",
  CREATE: "ComplementaryTask",
  GET_BY_VVE: "ComplementaryTask/vve",
  UPDATE: "ComplementaryTask",
  SEARCH: "ComplementaryTask/search",
  GET_BY_CODE: "/ComplementaryTask"
};

export const compTaskCategoryUris = {
  SEARCH: "CompTaskCategory",
  CREATE: "CompTaskCategory"
};

export const vveUris = {
  GET_ALL: "vve",
  SEARCH: "/vve/search",
  GET_EXECUTED_OPERATIONS: (code: number) => `/VVE/${code}`,
  ADD_EXECUTED_OPERATION: (code: number) =>
    `/VVE/add-executed-operation/${code}`,
};

export const privacyPolicyUris = {
  GET_ALL: "PrivacyPolicy",
  PUBLISH: "PrivacyPolicy",
  GET_NEWEST: "PrivacyPolicy/newest"
};

export const incidentTypeUris = {
  CREATE: "IncidentType",
  UPDATE: (code: string) => `IncidentType/${code}`,
  FIND_BY_CODE: (code: string) => `IncidentType/${code}`,
  SEARCH: "IncidentType"
};

export const incidentUris = {
  create: "Incidents",
  search: "Incidents",
  associateVVE: "Incidents/associate-vve",
  detachVVE: "Incidents/detach-vve",
  resolve: (code: string) => `Incidents/${code}/resolve`
};
