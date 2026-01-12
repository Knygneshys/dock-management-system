import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";
import type { UnloadVVNCreateDto } from "../../../infrastructure/dtos/vvn/unloadVVNCreateDto";

export function CreateUnloadVVN(vvnRepository: IVVNRepo) {
  return async (unloadVVNDto: UnloadVVNCreateDto) => await vvnRepository.createUnload(unloadVVNDto);
}
