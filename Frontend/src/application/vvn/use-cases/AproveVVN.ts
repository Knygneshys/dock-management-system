import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { VVNFeedbackDto } from "../../../infrastructure/dtos/vvn/vvnFeedbackDto";

export function AproveVVN(vvnRepository: IVVNRepo) {
  return async (vvnCode: number, feedback: VVNFeedbackDto) => await vvnRepository.aprove(vvnCode, feedback);
}
