import { Inject, Service } from 'typedi';
import IIncidentTypeService from '../IServices/IIncidentTypeService';
import config from '../../../config';
import { IIncidentTypeRepo } from '../../domain/IRepos/IIncidentTypeRepo';
import { Result } from '../../shared/logic/Result';
import { CreateIncidentTypeCommand } from '../commands/incident-type/CreateIncidentTypeCommand';
import { IncidentTypeMapper } from '../mappers/IncidentTypeMapper';
import { IncidentType } from '../../domain/entities/incidentType';
import { UpdateIncidentTypeCommand } from '../commands/incident-type/UpdateIncidentTypeCommand';
import { SearchIncidentTypeQuery } from '../queries/incident-type/SearchIncidentTypeQuery';
import { GenericCode } from '../../domain/object-values/genericCode';

@Service()
export default class IncidentTypeService implements IIncidentTypeService {
  constructor(@Inject(config.repos.incidentType.name) private incidentTypeRepo: IIncidentTypeRepo) {}

  public async getByCode(code: string): Promise<Result<IncidentType | string>> {
    const genericCodeOrError = GenericCode.create(code);

    if (genericCodeOrError.isFailure) {
      return Result.fail<string>(`Failed to create code: ${code}`);
    }
    const incidentType = await this.incidentTypeRepo.findByCode(genericCodeOrError.getValue()!);

    if (incidentType === null) {
      return Result.fail<string>(`An incident type of code: ${code} does not exist!`);
    }

    return Result.ok<IncidentType>(incidentType);
  }

  public async search(query: SearchIncidentTypeQuery): Promise<Result<IncidentType[]>> {
    const searchResults = await this.incidentTypeRepo.search(query);

    return Result.ok<IncidentType[]>(searchResults);
  }

  public async update(
    code: string,
    command: UpdateIncidentTypeCommand,
  ): Promise<Result<IncidentType> | Result<string>> {
    const genericCodeOrError = GenericCode.create(code);

    if (genericCodeOrError.isFailure) {
      return Result.fail<string>(`Failed to create code: ${code}`);
    }

    const incidentType = await this.incidentTypeRepo.findByCode(genericCodeOrError.getValue()!);

    if (incidentType === null) {
      return Result.fail<string>(`An incident type of code: ${code} does not exist!`);
    }

    if (command.parentIncidentTypeCode) {
      if (command.parentIncidentTypeCode === code) {
        return Result.fail<string>(`The parent code is the same as the incident type's code!`);
      }

      const parentGenericCodeOrError = GenericCode.create(command.parentIncidentTypeCode);

      if (genericCodeOrError.isFailure) {
        return Result.fail<string>(`Failed to create code: ${command.parentIncidentTypeCode}`);
      }

      const parentIncidentType = await this.incidentTypeRepo.findByCode(parentGenericCodeOrError.getValue()!);

      if (parentIncidentType === null) {
        return Result.fail<string>(
          `Failed to set parent. An incident type with code: ${command.parentIncidentTypeCode} does not exist!`,
        );
      }
    }

    const incidentTypeOrError = incidentType.update(command);
    if (incidentTypeOrError.isFailure) {
      return Result.fail<string>(incidentTypeOrError.errorValue());
    }

    const updatedIncidentType = await this.incidentTypeRepo.save(incidentType);

    return Result.ok<IncidentType>(updatedIncidentType);
  }

  public async getAll(): Promise<Result<IncidentType[]>> {
    const incidentTypes = await this.incidentTypeRepo.getAll();

    return Result.ok<IncidentType[]>(incidentTypes);
  }

  public async create(command: CreateIncidentTypeCommand): Promise<Result<string>> {
    const genericCodeOrError = GenericCode.create(command.code);

    if (genericCodeOrError.isFailure) {
      return Result.fail<string>(`Failed to create code: ${command.code}`);
    }

    const incidentTypeDocument = await this.incidentTypeRepo.findByCode(genericCodeOrError.getValue()!);

    if (incidentTypeDocument !== null) {
      return Result.fail<string>(`An incident type with code: ${command.code} already exists!`);
    }

    if (command.parentIncidentTypeCode) {
      const parentGenericCodeOrError = GenericCode.create(command.parentIncidentTypeCode);

      if (genericCodeOrError.isFailure) {
        return Result.fail<string>(`Failed to create code: ${command.parentIncidentTypeCode}`);
      }

      const parentIncidentType = await this.incidentTypeRepo.findByCode(parentGenericCodeOrError.getValue()!);

      if (parentIncidentType === null) {
        return Result.fail<string>(
          `Failed to set parent. An incident type with code: ${command.parentIncidentTypeCode} does not exist!`,
        );
      }
    }

    const incidentType = IncidentTypeMapper.mapCreateIncidentTypeCommandToOperationPlan(command);

    const result = await this.incidentTypeRepo.save(incidentType);

    return Result.ok<string>(`${result.code.value}`);
  }
}
