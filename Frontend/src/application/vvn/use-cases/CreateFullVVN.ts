import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { FullVVNCreateDto } from "../../../infrastructure/dtos/vvn/fullVVNCreateDto";

export function CreateFullVVN(vvnRepository: IVVNRepo) {
  return async (fullVVNDto: FullVVNCreateDto) => await vvnRepository.createFull(fullVVNDto);
}
