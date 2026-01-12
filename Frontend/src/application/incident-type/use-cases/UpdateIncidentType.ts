import { IIncidenTypeRepository } from "../../../domain/interfaces/IIncidentTypeRepository";
import { UpdateIncidentTypeCommand } from "../command/UpdateIncidentTypeCommand";

export function UpdateIncidentType(
  incidentTypeRepository: IIncidenTypeRepository,
) {
  return async (code: string, command: UpdateIncidentTypeCommand) =>
    await incidentTypeRepository.update(code, command);
}
