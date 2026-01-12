import { apiClient } from "../../../../../../../infrastructure/api/apiClient";

export const yardMaterialLoader = async () => {
  try {
    const data = await apiClient.get("PortLayout/material/yard");

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
