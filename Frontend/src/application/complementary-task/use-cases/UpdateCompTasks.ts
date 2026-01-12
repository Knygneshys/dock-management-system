import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";
import { UpdateCompTaskCommand } from "../commands/UpdateCompTaskCommand";

export function UpdateCompTask(compTaskRepo : ICompTaskRepo) {
    return async (command: UpdateCompTaskCommand, code: string) => await compTaskRepo.update(command, code);
}