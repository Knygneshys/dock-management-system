import { IVVERepository } from "../../../domain/interfaces/IVVERepository";

export const GetAllVVEs = (repo: IVVERepository) => {
  return async () => {
    return await repo.getAll();
  };
};