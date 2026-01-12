import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { VVNEditDto } from "../../../infrastructure/dtos/vvn/vvnEditDto";

export function UpdateVVN(vvnRepository: IVVNRepo) {
  return async (vvnUpdateDto: VVNEditDto, vvnCode: number) => await vvnRepository.update(vvnUpdateDto, vvnCode);
}
