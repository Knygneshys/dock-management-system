import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export function GetUserRole(userRepository: IUserRepository) {
  return async (email: string) => await userRepository.getRoleByEmail(email);
}
