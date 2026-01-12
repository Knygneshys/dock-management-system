import { userRoles } from "../../domain/Enums/userRoles";

export const getFormatedRoleName = (userRole: string) => {
  switch (userRole) {
    case userRoles.PortAuthorityOfficer:
      return "Port Authority Officer";
    case userRoles.LogisticsOperator:
      return "Logistics Operator";
    case userRoles.ShippingAgentRepresentative:
      return "Shipping Agent Representative";
    case userRoles.SystemAdmin:
      return "System Admin";
  }
};
