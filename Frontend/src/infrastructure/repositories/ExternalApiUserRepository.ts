import type { UserRole } from "../../domain/Enums/userRoles";
import type { IUserRepository } from "../../domain/interfaces/IUserRepository";
import type { DomainUser } from "../../domain/Types/entities/DomainUser";
import {
  userApprovePrivacyPolicy,
  assignRole,
  completeActivation,
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserRole,
} from "../api/clients/userApi";
import type { CompleteActivationDto } from "../dtos/user/completeActivationDto";
import type { UserAssignRoleDto } from "../dtos/user/userAssignRoleDto";
import { UserMapper } from "../mappers/userMapper";

export const ExternalApiUserRepository: IUserRepository = {
  create: async function (userModel: DomainUser): Promise<string | null> {
    const userGuid = await createUser(UserMapper.domainToDto(userModel));

    return userGuid;
  },
  getAll: async function (): Promise<DomainUser[]> {
    const users = await getAllUsers();

    return users.map((user) => UserMapper.dtoToDomain(user));
  },
  getRoleByEmail: async function (email: string): Promise<UserRole | null> {
    return await getUserRole(email);
  },
  getCurrentUser: async function (): Promise<DomainUser> {
    const user = await getCurrentUser();
    if (user) {
      return UserMapper.dtoToDomain(user);
    }
    throw new Error("No current user found");
  },
  completeActivation: async function (token: string): Promise<boolean> {
    const dto: CompleteActivationDto = { activationToken: token };
    const res = await completeActivation(dto);
    if (res) {
      return true;
    }
    return false;
  },
  assignRole: async function (dto: UserAssignRoleDto): Promise<boolean> {
    const res = await assignRole(dto);
    if (res) {
      return true;
    }
    return false;
  },
  approvePrivacyPolicy: async function (email: string): Promise<boolean> {
    const res = await userApprovePrivacyPolicy(email);
    if (res) {
      return true;
    }

    return false;
  },
};
