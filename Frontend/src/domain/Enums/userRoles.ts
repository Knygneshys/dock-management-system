export const userRoles = {
  PortAuthorityOfficer: "PortAuthorityOfficer",
  LogisticsOperator: "LogisticsOperator",
  ShippingAgentRepresentative: "ShippingAgentRepresentative",
  SystemAdmin: "SystemAdmin"
} as const;

export type UserRole = keyof typeof userRoles;
