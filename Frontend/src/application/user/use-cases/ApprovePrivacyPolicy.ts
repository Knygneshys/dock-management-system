import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export function ApprovePrivacyPolicy(userRepository: IUserRepository) {
  return async (email: string) =>
    await userRepository.approvePrivacyPolicy(email);
}
