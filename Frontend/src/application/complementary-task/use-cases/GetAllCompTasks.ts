import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";

export function GetAllCompTasks(compTaskRepo : ICompTaskRepo) {
    return async () => await compTaskRepo.getAll();
}