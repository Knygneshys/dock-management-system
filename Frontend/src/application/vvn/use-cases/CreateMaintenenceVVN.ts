import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { VVNCreateDto } from "../../../infrastructure/dtos/vvn/vvnCreateDto";

export function CreateMaintenenceVVN(vvnRepository: IVVNRepo) {
  return async (vvn: VVNCreateDto) => await vvnRepository.createMaintenence(vvn);
}
