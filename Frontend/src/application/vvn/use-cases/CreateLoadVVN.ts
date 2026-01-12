import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { LoadVVNCreateDto } from "../../../infrastructure/dtos/vvn/loadVVNCreateDto";

export function CreateLoadVVN(vvnRepository: IVVNRepo) {
  return async (loadVVNDto: LoadVVNCreateDto) => await vvnRepository.createLoad(loadVVNDto);
}
