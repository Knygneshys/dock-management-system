import { PublishPrivacyPolicyCommand } from "../../application/privacy-policy/commands/PublishPrivacyPolicyCommand";
import { PrivacyPolicy } from "../Types/entities/PrivacyPolicy";

export interface IPrivacyPolicyRepository {
  getAll(): Promise<PrivacyPolicy[]>;

  create(command: PublishPrivacyPolicyCommand): Promise<number | null>;

  getNewest(): Promise<PrivacyPolicy | null>;
}
