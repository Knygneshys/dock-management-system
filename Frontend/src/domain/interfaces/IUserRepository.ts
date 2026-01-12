import type { UserAssignRoleDto } from "../../infrastructure/dtos/user/userAssignRoleDto";
import type { UserRole } from "../Enums/userRoles";
import type { DomainUser } from "../Types/entities/DomainUser";

export interface IUserRepository {
  create(userModel: DomainUser): Promise<string | null>;
  getAll(): Promise<DomainUser[]>;
  getRoleByEmail(email: string): Promise<UserRole | null>;
  getCurrentUser(): Promise<DomainUser>;
  completeActivation(token: string): Promise<boolean>;
  assignRole(assignRoleDto: UserAssignRoleDto): Promise<boolean>;
  approvePrivacyPolicy(email: string): Promise<boolean>;
}
