import { publishPrivacyPolicy } from "../../infrastructure/api/clients/privacyPolicyApi";
import { ExternalApiPrivacyPolicyRepository } from "../../infrastructure/repositories/ExternalApiPrivacyPolicyRepository";
import { GetAllPriacyPolicies } from "./use-cases/GetAllPrivacyPolicies";
import { GetNewestPrivacyPolicy } from "./use-cases/GetNewestPrivacyPolicy";
import { PublishPrivacyPolicy } from "./use-cases/PublishPrivacyPolicy";

export const PublishPrivacyPolicyUseCase = PublishPrivacyPolicy(
  ExternalApiPrivacyPolicyRepository,
);

export const GetNewestPrivacyPolicyUseCase = GetNewestPrivacyPolicy(
  ExternalApiPrivacyPolicyRepository,
);

export const GetAllPrivacyPoliciesUseCase = GetAllPriacyPolicies(
  ExternalApiPrivacyPolicyRepository,
);
