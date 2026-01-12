import { IPrivacyPolicyRepository } from "../../../domain/interfaces/IPrivacyPolicyRepository";

export function GetAllPriacyPolicies(
  privacyPolicyRepository: IPrivacyPolicyRepository,
) {
  return async () => await privacyPolicyRepository.getAll();
}
