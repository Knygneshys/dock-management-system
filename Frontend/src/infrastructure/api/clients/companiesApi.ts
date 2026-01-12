import type { Company } from "../../../domain/Types/entities/Company";
import { companyUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllCompanies = async () => {
  try {
    const data = await apiClient.get<Company[]>(companyUris.GET_ALL);

    return data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
