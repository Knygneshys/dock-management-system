import { IncidentType } from '@src/domain/entities/incidentType';
import { SeverityClassification } from '@src/domain/enums/severityClassification';
import { GenericCode } from '@src/domain/object-values/genericCode';
import { CreateIncidentTypeCommand } from '@src/use-cases/commands/incident-type/CreateIncidentTypeCommand';
import { UpdateIncidentTypeCommand } from '@src/use-cases/commands/incident-type/UpdateIncidentTypeCommand';

export class IncidentTypeProvider {
  public static provideIncidentType() {
    const code = GenericCode.create('INC001').getValue();
    return IncidentType.create({
      code: code!,
      name: 'Hardware Failure',
      description: 'Server rack power loss',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: 'PARENT01',
    }).getValue()!;
  }

  public static provideIncidentTypeWithoutParent() {
    const code = GenericCode.create('INC001').getValue();
    return IncidentType.create({
      code: code!,
      name: 'Hardware Failure',
      description: 'Server rack power loss',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: null,
    }).getValue()!;
  }

  public static provideCreateIncidentTypeCommand(): CreateIncidentTypeCommand {
    return {
      code: '59KAL',
      name: 'Hardware Failure',
      description: 'Server rack power loss',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: null,
    };
  }

  public static provideCreateIncidentTypeCommandWithParent(): CreateIncidentTypeCommand {
    return {
      code: '59KAL',
      name: 'Hardware Failure',
      description: 'Server rack power loss',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: '9581K',
    };
  }

  public static provideUpdateIncidentTypeCommand(): UpdateIncidentTypeCommand {
    return {
      name: 'Water Damage',
      description: 'Equipment was damaged by water',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: null,
    };
  }

  public static provideUpdateIncidentTypeCommandWithParent(): UpdateIncidentTypeCommand {
    return {
      name: 'Water Damage',
      description: 'Equipment was damaged by water',
      severity: SeverityClassification.Critical,
      parentIncidentTypeCode: '9581K',
    };
  }
}
