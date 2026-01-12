import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";

export function GetAllTasksByVVE(compTaskRepo : ICompTaskRepo) {
    return async (code: number) => await compTaskRepo.getAllTasksByVVE(code);
}