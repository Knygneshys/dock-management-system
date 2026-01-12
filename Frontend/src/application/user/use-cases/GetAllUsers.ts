import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export function GetAllUsers(userRepository: IUserRepository) {
  return async () => await userRepository.getAll();
}
