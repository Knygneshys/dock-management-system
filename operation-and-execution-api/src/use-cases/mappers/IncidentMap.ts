import { Incident } from '../../domain/entities/incident';
import { IncidentType } from '../../domain/entities/incidentType';
import { VVE } from '../../domain/entities/vve';
import { IncidentStatus } from '../../domain/enums/incidentStatus';
import { GenericCode } from '../../domain/object-values/genericCode';
import { UserEmail } from '../../domain/object-values/userEmail';
import { Mapper } from '../../shared/infra/Mapper';
import { Result } from '../../shared/logic/Result';
import { IIncidentDTO } from '../dto/incident-dtos/IIncidentDTO';
import { IVVEDTO } from '../dto/vve-dtos/IVVEDTO';
import { VVEMap } from './VVEMap';
import { IIncidentPersistence } from '../dataschema/IIncidentPersistence';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Time } from '../../domain/object-values/time';
import { IncidentTypeMapper } from './IncidentTypeMapper';

export class IncidentMap extends Mapper<Incident> {
  public static toDTO(incident: Incident): IIncidentDTO {
    const affectedVVEsDTOs: IVVEDTO[] = [];
    incident.afectedVVEs.forEach((vve) => {
      const dto = VVEMap.toDTO(vve);
      affectedVVEsDTOs.push(dto);
    });
    let duration: { hour: number; minute: number } | undefined = undefined;
    if (incident.duration) {
      duration = { hour: incident.duration.hour, minute: incident.duration.minute };
    }
    return {
      code: incident.code.value,
      startISO: incident.start.toISOString(),
      endISO: incident.end?.toISOString(),
      description: incident.description,
      responsibleUserEmail: incident.responsibleUserEmail.value,
      status: incident.status,
      afectedVVEs: affectedVVEsDTOs,
      duration: duration,
      type: IncidentTypeMapper.toDto(incident.type),
    } as IIncidentDTO;
  }

  public static dtoToDomain(dto: IIncidentDTO, incidentType: IncidentType, afectedVVEs: VVE[]): Result<Incident> {
    if (
      dto.code === undefined ||
      dto.startISO === undefined ||
      dto.description === undefined ||
      dto.responsibleUserEmail === undefined ||
      dto.status === undefined
    ) {
      return Result.fail('Missing required fields in DTO');
    }

    const incidentCodeResult = GenericCode.create(dto.code);
    if (incidentCodeResult.isFailure) {
      return Result.fail(`Incident Code: ${incidentCodeResult.errorValue()}`);
    }

    const start = new Date(dto.startISO);
    if (isNaN(start.getTime())) {
      return Result.fail('Parsing start ISO date');
    }

    let end: Date | undefined = undefined;
    if (dto.endISO) {
      end = new Date(dto.endISO);
      if (isNaN(end.getTime())) {
        return Result.fail('Parsing end ISO date');
      }
    }

    const userEmailResult = UserEmail.create(dto.responsibleUserEmail);
    if (userEmailResult.isFailure) {
      return Result.fail(`User Email: ${userEmailResult.errorValue()}`);
    }

    let duration: Time | undefined;
    if (dto.duration) {
      const durationResult = Time.create({ hour: dto.duration.hour, minute: dto.duration.minute });
      if (durationResult.isFailure) {
        return Result.fail(durationResult.errorValue());
      }
      duration = durationResult.getValue();
    }

    const incidentResult = Incident.create({
      code: incidentCodeResult.getValue()!,
      type: incidentType,
      start: start,
      end: end,
      description: dto.description,
      responsibleUserEmail: userEmailResult.getValue()!,
      afectedVVEs: afectedVVEs,
      status: dto.status,
      duration: duration,
    });
    new UniqueEntityID(dto.code.toString());

    return incidentResult;
  }

  public static persistenceToDomain(
    incidentModel: IIncidentPersistence,
    incidentType: IncidentType,
    afectedVVEs: VVE[],
  ): Result<Incident> {
    const incidentDTO: IIncidentDTO = {};
    incidentDTO.code = incidentModel.code;
    incidentDTO.description = incidentModel.description;
    if (incidentModel.duration) incidentDTO.duration = incidentModel.duration;
    if (incidentModel.endISO) incidentDTO.endISO = incidentModel.endISO;
    incidentDTO.responsibleUserEmail = incidentModel.responsibleUserEmail;
    incidentDTO.startISO = incidentModel.startISO;
    incidentDTO.status = incidentModel.status as IncidentStatus;

    return this.dtoToDomain(incidentDTO, incidentType, afectedVVEs);
  }

  public static toPersistence(incident: Incident): IIncidentPersistence {
    return {
      code: incident.code.value,
      startISO: incident.start.toISOString(),
      endISO: incident.end?.toISOString(),
      description: incident.description,
      responsibleUserEmail: incident.responsibleUserEmail.value,
      status: incident.status,
      typeCode: incident.type.code.value,
      ...(incident.duration && {
        duration: {
          hour: incident.duration.hour,
          minute: incident.duration.minute,
        },
      }),
    };
  }
}
