import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { VVNFeedbackDto } from "../../../infrastructure/dtos/vvn/vvnFeedbackDto";

export function RejectVVN(vvnRepository: IVVNRepo) {
  return async (vvnCode: number, feedback: VVNFeedbackDto) => await vvnRepository.reject(vvnCode, feedback);
}
