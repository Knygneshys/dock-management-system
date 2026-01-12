import type { ISARRepository } from "../../../domain/interfaces/ISARRepository";
import type { CreateSARCommand } from "../commands/CreateSARCommand";

export function CreateSar(sarRepo : ISARRepository) {
    return async (command : CreateSARCommand) => await sarRepo.create(command);
}