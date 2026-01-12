import { IPrivacyPolicyRepository } from "../../../domain/interfaces/IPrivacyPolicyRepository";
import { PublishPrivacyPolicyCommand } from "../commands/PublishPrivacyPolicyCommand";

export function PublishPrivacyPolicy(
  privacyPolicyRepo: IPrivacyPolicyRepository,
) {
  return async (command: PublishPrivacyPolicyCommand) =>
    await privacyPolicyRepo.create(command);
}
