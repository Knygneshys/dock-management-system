import { apiClient } from "../../../../../../../infrastructure/api/apiClient";

export const waterMaterialLoader = async () => {
  try {
    const data = await apiClient.get("PortLayout/material/water");

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
