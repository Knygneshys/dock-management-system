import { ICompTaskRepo } from "../../../domain/interfaces/ICompTaskRepo";
import { CreateCompTaskCommand } from "../commands/CreateCompTaskCommand";

export function CreateCompTask(compTaskRepo : ICompTaskRepo) {
    return async (command: CreateCompTaskCommand) => await compTaskRepo.create(command);
}