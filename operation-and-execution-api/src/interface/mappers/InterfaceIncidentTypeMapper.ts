import { IncidentType } from '../../domain/entities/incidentType';
import { IncidentTypeResponseDto } from '../dtos/incident-type/IncidentTypeResponseDto';

export class InterfaceIncidentTypeMapper {
  public static mapIncidentTypeToIncidentTypeResponseDto(incidentType: IncidentType): IncidentTypeResponseDto {
    return {
      code: incidentType.code.value,
      name: incidentType.name,
      description: incidentType.description,
      severity: incidentType.severity,
      parentIncidentTypeCode: incidentType.parentIncidentTypeCode,
    };
  }
}
