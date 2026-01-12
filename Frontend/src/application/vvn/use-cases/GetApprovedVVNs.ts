import { IVVNRepo } from "../../../domain/interfaces/IVVNRepo";

export const GetApprovedVVNs = (repo: IVVNRepo) => {
  return async () => {
    return await repo.getApproved();
  };
};