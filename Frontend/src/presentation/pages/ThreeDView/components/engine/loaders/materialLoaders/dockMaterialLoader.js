import { apiClient } from "../../../../../../../infrastructure/api/apiClient";

export const dockMaterialLoader = async () => {
  try {
    const data = await apiClient.get("PortLayout/material/dock");

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
