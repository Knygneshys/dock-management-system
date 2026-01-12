import { IIncidenTypeRepository } from "../../../domain/interfaces/IIncidentTypeRepository";

export function FindIncidentTypeByCode(
  incidentTypeRepository: IIncidenTypeRepository,
) {
  return async (code: string) => await incidentTypeRepository.findByCode(code);
}
