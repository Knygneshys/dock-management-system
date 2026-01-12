import type { FullVVNCreateDto } from "../../infrastructure/dtos/vvn/fullVVNCreateDto";
import type { LoadVVNCreateDto } from "../../infrastructure/dtos/vvn/loadVVNCreateDto";
import type { UnloadVVNCreateDto } from "../../infrastructure/dtos/vvn/unloadVVNCreateDto";
import type { VVNCreateDto } from "../../infrastructure/dtos/vvn/vvnCreateDto";
import type { VVNEditDto } from "../../infrastructure/dtos/vvn/vvnEditDto";
import type { VVNFeedbackDto } from "../../infrastructure/dtos/vvn/vvnFeedbackDto";
import type { VVN } from "../Types/entities/VVN";

export interface IVVNRepo {
  getAll(): Promise<VVN[]>;
  createMaintenence(vvnCreateDto: VVNCreateDto): Promise<number | undefined>;
  createLoad(loadVvnCreateDto: LoadVVNCreateDto): Promise<number | undefined>;
  createUnload(
    unloadVvnCreateDto: UnloadVVNCreateDto
  ): Promise<number | undefined>;
  createFull(fullVvnCreateDto: FullVVNCreateDto): Promise<number | undefined>;
  getByCode(vvnCode: number): Promise<VVN | undefined>;
  update(vvnUpdateDto: VVNEditDto, vvnCode: number): Promise<VVN | undefined>;
  sendBack(
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined>;
  reject(
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined>;
  aprove(
    vvnCode: number,
    feedback: VVNFeedbackDto
  ): Promise<VVNFeedbackDto | undefined>;
  getApproved: () => Promise<VVN[]>;
}
