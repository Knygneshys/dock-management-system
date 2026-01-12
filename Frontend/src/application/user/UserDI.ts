import { ExternalApiUserRepository } from "../../infrastructure/repositories/ExternalApiUserRepository";
import { ApprovePrivacyPolicy } from "./use-cases/ApprovePrivacyPolicy";
import { AssignUserRole } from "./use-cases/AssignUserRole";
import { GetAllUsers } from "./use-cases/GetAllUsers";
import { GetCurrentUser } from "./use-cases/GetCurrentUser";
import { GetUserRole } from "./use-cases/GetUserRole";

export const GetAllUsersUsecase = GetAllUsers(ExternalApiUserRepository);
export const AssignUserRoleUsecase = AssignUserRole(ExternalApiUserRepository);
export const GetUserRoleUsecase = GetUserRole(ExternalApiUserRepository);
export const GetCurrentUserUsecase = GetCurrentUser(ExternalApiUserRepository);
export const ApprovePrivacyPolicyUseCase = ApprovePrivacyPolicy(
  ExternalApiUserRepository,
);
