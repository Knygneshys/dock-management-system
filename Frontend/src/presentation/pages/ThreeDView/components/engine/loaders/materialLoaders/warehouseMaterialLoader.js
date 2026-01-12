import { apiClient } from "../../../../../../../infrastructure/api/apiClient";

export const warehouseMaterialLoader = async () => {
  try {
    const data = await apiClient.get("PortLayout/material/warehouse");

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
