import axios, { Axios } from "axios";
import { PublishPrivacyPolicyCommand } from "../../../application/privacy-policy/commands/PublishPrivacyPolicyCommand";
import { apiClient } from "../apiClient";
import { privacyPolicyUris } from "../api-utils/apiUriUtils";
import { PrivacyPolicy } from "../../../domain/Types/entities/PrivacyPolicy";

export const publishPrivacyPolicy = async (
  command: PublishPrivacyPolicyCommand,
) => {
  try {
    const version = await apiClient.post<number>(
      privacyPolicyUris.PUBLISH,
      command,
    );

    return version.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data ||
          error.message ||
          "Failed to publish privacy policy! ",
      );
    }

    return null;
  }
};

export const getNewestPrivacyPolicy = async () => {
  try {
    const version = await apiClient.get<PrivacyPolicy>(
      privacyPolicyUris.GET_NEWEST,
    );

    return version.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data ||
          error.message ||
          "Failed to fetch newest privacy policy!",
      );
    }

    return null;
  }
};

export const getAllPrivacyPolicies = async () => {
  try {
    const privacyPolicies = await apiClient.get<PrivacyPolicy[]>(
      privacyPolicyUris.GET_ALL,
    );

    return privacyPolicies.data;
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error?.response?.data ||
          error.message ||
          "Failed to fetch privacy policies!",
      );
    }

    return [];
  }
};
