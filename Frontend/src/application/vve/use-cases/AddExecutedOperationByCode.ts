import { IVVERepository } from "../../../domain/interfaces/IVVERepository";
import { ExecutedOperation } from "../../../domain/Types/entities/ExecutedOperation";

export function AddExecutedOperationByCode(vveRepo: IVVERepository) {
  return async (code: number, executedOperation: ExecutedOperation) =>
    await vveRepo.addExecutedOperationByCode(code, executedOperation);
}
