import { IIncidenTypeRepository } from "../../../domain/interfaces/IIncidentTypeRepository";
import { IncidentType } from "../../../domain/Types/entities/IncidentType";

export function CreateIncidentType(
  incidentTypeRepository: IIncidenTypeRepository,
) {
  return async (incidentType: IncidentType) =>
    await incidentTypeRepository.create(incidentType);
}
