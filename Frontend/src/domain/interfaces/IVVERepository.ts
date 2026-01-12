import { VVESearchQuery } from "../../application/vve/queries/VVESearchQuery";
import { ExecutedOperation } from "../Types/entities/ExecutedOperation";
import { VVE } from "../Types/entities/VVE";

export interface IVVERepository {
  getAll(): Promise<VVE[]>;
  search(query: VVESearchQuery): Promise<VVE[]>;
  getExecutedOperationsByCode(code: number): Promise<ExecutedOperation[]>;
  addExecutedOperationByCode(
    code: number,
    executedOperation: ExecutedOperation,
  ): Promise<string | null>;
}
