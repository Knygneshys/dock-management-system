import { IPrivacyPolicyRepository } from "../../../domain/interfaces/IPrivacyPolicyRepository";

export function GetNewestPrivacyPolicy(
  privacyPolicyRepo: IPrivacyPolicyRepository,
) {
  return async () => await privacyPolicyRepo.getNewest();
}
