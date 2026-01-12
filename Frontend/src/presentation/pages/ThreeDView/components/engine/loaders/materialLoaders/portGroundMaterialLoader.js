import { apiClient } from "../../../../../../../infrastructure/api/apiClient";

export const portGroundMaterialLoader = async () => {
  try {
    const data = await apiClient.get("PortLayout/material/portGround");

    return data.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
