import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import type { UserAssignRoleDto } from "../../../infrastructure/dtos/user/userAssignRoleDto";

export function AssignUserRole(userRepository: IUserRepository) {
  return async (userAssignRoleDto: UserAssignRoleDto) => await userRepository.assignRole(userAssignRoleDto);
}
