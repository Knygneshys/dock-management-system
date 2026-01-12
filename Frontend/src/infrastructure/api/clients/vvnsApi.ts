import type { VVNCreateDto } from "../../dtos/vvn/vvnCreateDto";
import type { LoadVVNCreateDto } from "../../dtos/vvn/loadVVNCreateDto";
import type { UnloadVVNCreateDto } from "../../dtos/vvn/unloadVVNCreateDto";
import type { FullVVNCreateDto } from "../../dtos/vvn/fullVVNCreateDto";
import type { VVNFeedbackDto } from "../../dtos/vvn/vvnFeedbackDto";
import type { VVN } from "../../../domain/Types/entities/VVN";
import type { VVNEditDto } from "../../dtos/vvn/vvnEditDto";
import { vvnUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllVVNs = async () => {
  const response = await apiClient.get(vvnUris.getAll);
  return response.data;
};

export const createMaintenenceVVN = async (vvnCreateDto: VVNCreateDto) => {
  const response = await apiClient.post<number>(
    vvnUris.createMaintenece,
    vvnCreateDto
  );
  const vvnCode = response.data;

  return vvnCode;
};

export const createLoadVVN = async (loadVvnCreateDto: LoadVVNCreateDto) => {
  const response = await apiClient.post<number>(
    vvnUris.createLoad,
    loadVvnCreateDto
  );
  const vvnCode = response.data;

  return vvnCode;
};

export const createUnloadVVN = async (
  unloadVvnCreateDto: UnloadVVNCreateDto
) => {
  const response = await apiClient.post<number>(
    vvnUris.createUnload,
    unloadVvnCreateDto
  );
  const vvnCode = response.data;

  return vvnCode;
};

export const createFullVVN = async (fullVvnCreateDto: FullVVNCreateDto) => {
  const response = await apiClient.post<number>(
    vvnUris.createFull,
    fullVvnCreateDto
  );
  const vvnCode = response.data;

  return vvnCode;
};

export const getVVNByCode = async (vvnCode: number) => {
  const response = await apiClient.get<VVN>(vvnUris.getByCode(vvnCode));
  const vvn = response.data;
  return vvn;
};

export const sendBackVVN = async (
  feedback: VVNFeedbackDto,
  vvnCode: number
) => {
  const response = await apiClient.put<VVNFeedbackDto>(
    vvnUris.sendBack(vvnCode),
    feedback
  );
  const feedbackResponse = response.data;

  return feedbackResponse;
};

export const aproveVVN = async (feedback: VVNFeedbackDto, vvnCode: number) => {
  const response = await apiClient.put<VVNFeedbackDto>(
    vvnUris.aprove(vvnCode),
    feedback
  );
  const feedbackResponse = response.data;

  return feedbackResponse;
};

export const rejectVVN = async (feedback: VVNFeedbackDto, vvnCode: number) => {
  const response = await apiClient.put<VVNFeedbackDto>(
    vvnUris.reject(vvnCode),
    feedback
  );
  const feedbackResponse = response.data;

  return feedbackResponse;
};

export const updateVVN = async (vvnUpdateDto: VVNEditDto, vvnCode: number) => {
  const response = await apiClient.put<VVN>(
    vvnUris.updateByCode(vvnCode),
    vvnUpdateDto
  );

  return response.data;
};

export const getUnplannedVVNs = async () => {
  const response = await apiClient.get<VVN[]>(vvnUris.getApproved);
  return response.data;
};