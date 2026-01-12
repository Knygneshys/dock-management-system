import type { ShippingAgentRepresentative } from "../../../domain/Types/entities/ShippingAgentRepresentative";
import type { VVN } from "../../../domain/Types/entities/VVN";
import { sarUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllSARs = async () => {
  const data = await apiClient.get(sarUris.getAll);
  return data.data as ShippingAgentRepresentative[];
};

export const createSar = async (sar: ShippingAgentRepresentative) => {
  const data = await apiClient.post(sarUris.create, sar);
  const sarId = data.data as string;
  return sarId;
};

export const getAllSarVvns = async () => {
  const response = await apiClient.get<VVN[]>(sarUris.getAllSarVvns);

  return response.data;
};
