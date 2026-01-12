import { operationPlanUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const deleteOperationPlansByDate = async (date: Date) => {
  const dateString = date.toISOString().split("T")[0];
  const response = await apiClient.delete(operationPlanUris.DELETE_BY_DATE(dateString));
  return response.data;
};
