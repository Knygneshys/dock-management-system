import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";
import { CompTaskSearchQuery } from "../queries/CompTaskSearchQuery";

export function SearchCompTasks(compTaskRepo : ICompTaskRepo) {
    return async (query: CompTaskSearchQuery) => await compTaskRepo.search(query);
}