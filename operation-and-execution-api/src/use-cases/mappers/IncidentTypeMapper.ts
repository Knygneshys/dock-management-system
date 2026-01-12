import { IncidentType } from '../../domain/entities/incidentType';
import { GenericCode } from '../../domain/object-values/genericCode';
import { Mapper } from '../../shared/infra/Mapper';
import { CreateIncidentTypeCommand } from '../commands/incident-type/CreateIncidentTypeCommand';
import { IIncidentTypePersistence } from '../dataschema/IIncidentTypePersistence';
import { IIncidentTypeDTO } from '../dto/incident-type-dtos/IIncidentTypeDTO';

export class IncidentTypeMapper extends Mapper<IncidentType> {
  public static toPersistence(incidentType: IncidentType): IIncidentTypePersistence {
    return {
      code: incidentType.code.value,
      name: incidentType.name,
      description: incidentType.description,
      severity: incidentType.severity,
      parentIncidentTypeCode: incidentType.parentIncidentTypeCode,
    };
  }

  public static toDto(incidentType: IncidentType): IIncidentTypeDTO {
    return {
      code: incidentType.code.value,
      name: incidentType.name,
      description: incidentType.description,
      severity: incidentType.severity,
      ...(incidentType.parentIncidentTypeCode && { parentIncidentTypeCode: incidentType.parentIncidentTypeCode }),
    };
  }

  public static async toDomain(persistence: IIncidentTypePersistence): Promise<IncidentType> {
    const codeOrError = GenericCode.create(persistence.code);
    const code = codeOrError.getValue()!;

    const incidentType = IncidentType.create({
      code: code,
      name: persistence.name,
      description: persistence.description,
      severity: persistence.severity,
      parentIncidentTypeCode: persistence.parentIncidentTypeCode,
    });

    return incidentType.getValue()!;
  }

  public static mapCreateIncidentTypeCommandToOperationPlan(command: CreateIncidentTypeCommand): IncidentType {
    const codeOrError = GenericCode.create(command.code);
    const code = codeOrError.getValue()!;

    const incidentType = IncidentType.create({
      code: code,
      name: command.name,
      description: command.description,
      severity: command.severity,
      parentIncidentTypeCode: command.parentIncidentTypeCode,
    });

    return incidentType.getValue()!;
  }
}
