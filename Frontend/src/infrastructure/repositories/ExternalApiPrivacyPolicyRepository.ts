import { PublishPrivacyPolicyCommand } from "../../application/privacy-policy/commands/PublishPrivacyPolicyCommand";
import { IPrivacyPolicyRepository } from "../../domain/interfaces/IPrivacyPolicyRepository";
import { PrivacyPolicy } from "../../domain/Types/entities/PrivacyPolicy";
import {
  getAllPrivacyPolicies,
  getNewestPrivacyPolicy,
  publishPrivacyPolicy,
} from "../api/clients/privacyPolicyApi";

export const ExternalApiPrivacyPolicyRepository: IPrivacyPolicyRepository = {
  getAll: async function (): Promise<PrivacyPolicy[]> {
    return await getAllPrivacyPolicies();
  },

  create: async function (
    command: PublishPrivacyPolicyCommand,
  ): Promise<number | null> {
    return await publishPrivacyPolicy(command);
  },

  getNewest: async function (): Promise<PrivacyPolicy | null> {
    return await getNewestPrivacyPolicy();
  },
};
