import { IVVERepository } from "../../../domain/interfaces/IVVERepository";

export function GetExecutedOperationsByCode(vveRepository: IVVERepository) {
  return async (code: number) =>
    await vveRepository.getExecutedOperationsByCode(code);
}
