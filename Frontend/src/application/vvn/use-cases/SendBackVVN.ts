import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { VVNFeedbackDto } from "../../../infrastructure/dtos/vvn/vvnFeedbackDto";

export function SendBackVVN(vvnRepository: IVVNRepo) {
  return async (vvnCode: number, feedback: VVNFeedbackDto) => await vvnRepository.sendBack(vvnCode, feedback);
}
