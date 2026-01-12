import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";

export const GetCompTaskByCode = (repo: ICompTaskRepo) => {
  return async (code: string) => {
    return await repo.getByCode(code);
  };
};