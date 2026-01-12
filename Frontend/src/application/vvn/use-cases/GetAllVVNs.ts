import type { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";

export function GetAllVVNs(vvnRepository: IVVNRepo) {
  return async () => await vvnRepository.getAll();
}
