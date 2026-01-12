import type { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export function GetCurrentUser(userRepository: IUserRepository) {
  return async () => await userRepository.getCurrentUser();
}
