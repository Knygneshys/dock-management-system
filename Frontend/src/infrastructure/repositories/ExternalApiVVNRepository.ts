import type { IVVNRepo } from "../../domain/interfaces/IVVNRepo";
import type { VVN } from "../../domain/Types/entities/VVN";
import {
  aproveVVN,
  createFullVVN,
  createLoadVVN,
  createMaintenenceVVN,
  createUnloadVVN,
  getAllVVNs,
  getUnplannedVVNs,
  getVVNByCode,
  rejectVVN,
  sendBackVVN,
  updateVVN,
} from "../api/clients/vvnsApi";
import type { FullVVNCreateDto } from "../dtos/vvn/fullVVNCreateDto";
import type { LoadVVNCreateDto } from "../dtos/vvn/loadVVNCreateDto";
import type { UnloadVVNCreateDto } from "../dtos/vvn/unloadVVNCreateDto";
import type { VVNCreateDto } from "../dtos/vvn/vvnCreateDto";
import type { VVNEditDto } from "../dtos/vvn/vvnEditDto";
import type { VVNFeedbackDto } from "../dtos/vvn/vvnFeedbackDto";

export const ExternalApiVVNRepository: IVVNRepo = {
  getAll: async function (): Promise<VVN[]> {
    return await getAllVVNs();
  },
  createMaintenence: async function (
    vvnCreateDto: VVNCreateDto
  ): Promise<number | undefined> {
    return await createMaintenenceVVN(vvnCreateDto);
  },
  createLoad: async function (
    loadVvnCreateDto: LoadVVNCreateDto
  ): Promise<number | undefined> {
    return await createLoadVVN(loadVvnCreateDto);
  },
  createUnload: async function (
    unloadVvnCreateDto: UnloadVVNCreateDto
  ): Promise<number | undefined> {
    return await createUnloadVVN(unloadVvnCreateDto);
  },
  createFull: async function (
    fullVvnCreateDto: FullVVNCreateDto
  ): Promise<number | undefined> {
    return await createFullVVN(fullVvnCreateDto);
  },
  getByCode: async function (vvnCode: number): Promise<VVN | undefined> {
    return await getVVNByCode(vvnCode);
  },
  update: async function (
    vvnUpdateDto: VVNEditDto,
    vvnCode: number
  ): Promise<VVN | undefined> {
    return await updateVVN(vvnUpdateDto, vvnCode);
  },
  sendBack: async function (
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined> {
    return await sendBackVVN(feedback, vvnCode);
  },
  reject: async function (
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined> {
    return await rejectVVN(feedback, vvnCode);
  },
  aprove: async function (
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined> {
    return await aproveVVN(feedback, vvnCode);
  },

  getApproved: async () => {
  return await getUnplannedVVNs();
},
};
