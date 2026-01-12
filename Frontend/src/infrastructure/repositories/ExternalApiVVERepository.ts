import { IVVERepository } from "../../domain/interfaces/IVVERepository";
import {
  addExecutedOperationToVve,
  getAllVVEs,
  getExecutedOperationsByVveCode,
  searchVVEs,
} from "../api/clients/vveApi";
import { VVESearchQuery } from "../../application/vve/queries/VVESearchQuery";
import { VVE } from "../../domain/Types/entities/VVE";
import { ExecutedOperation } from "../../domain/Types/entities/ExecutedOperation";

export const ExternalApiVVERepository: IVVERepository = {
  async getAll() {
    return await getAllVVEs();
  },

  async search(query: VVESearchQuery): Promise<VVE[]> {
    return await searchVVEs(query);
  },

  async getExecutedOperationsByCode(
    code: number,
  ): Promise<ExecutedOperation[]> {
    return await getExecutedOperationsByVveCode(code);
  },

  addExecutedOperationByCode: async function (
    code: number,
    executedOperation: ExecutedOperation,
  ): Promise<string | null> {
    return await addExecutedOperationToVve(code, executedOperation);
  },
};
