import type { UserRole } from "../../Enums/userRoles";
import type { User } from "@auth0/auth0-react";

type UserComplement = {
  role: UserRole;
  isActive: boolean;
  hasReadPrivacyPolicy: boolean;
};

export type DomainUser = User & UserComplement;
