import { GenericCode } from '../../domain/object-values/genericCode';
import { Mapper } from '../../shared/infra/Mapper';
import { Result } from '../../shared/logic/Result';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { compTaskStatus } from '../../domain/enums/compTaskStatus';
import { ICompTaskPersistence } from '../dataschema/ICompTaskPersistence';
import { ICompTaskDTO } from '../dto/ICompTaskDTO';
import { ComplementaryTask } from '../../domain/entities/ComplementaryTask';
import { ICompTaskUpdateDTO } from '../dto/ICompTaskUpdateDTO';
import { VVNCode } from '../../domain/object-values/vvnCode';

export class CompTaskMap extends Mapper<ComplementaryTask> {

  public static toDTO(ct: ComplementaryTask): ICompTaskDTO {
    return {
      code: ct.code.value,
      categoryCode: ct.categoryCode.value,
      vveCode: ct.vveCode.value,
      team: ct.team,
      status: ct.status,
      start: ct.start,
      end: ct.end,
      impactOnOperations: ct.impactOnOperations
    };
  }

  public static toDomainProps(dto: ICompTaskDTO): Result<{
    code: GenericCode;
    categoryCode: GenericCode;
    vveCode: VVNCode;
    team: string;
    status: compTaskStatus;
    start: Date;
    end: Date | undefined;
    impactOnOperations: boolean;
}> {
    if (
        dto.code === undefined ||
        dto.categoryCode === undefined ||
        dto.vveCode === undefined ||
        dto.team === undefined ||
        dto.status === undefined ||
        dto.start === undefined ||
        dto.impactOnOperations === undefined
    ) {
        return Result.fail('Missing required fields in ComplementaryTask DTO');
    }

    const codeResult = GenericCode.create(dto.code);
    if (codeResult.isFailure) {
        return Result.fail(codeResult.errorValue());
    }

    const categoryCodeResult = GenericCode.create(dto.categoryCode);
    if (categoryCodeResult.isFailure) {
        return Result.fail(categoryCodeResult.errorValue());
    }

    const vveCodeResult = VVNCode.create(dto.vveCode);
    if (vveCodeResult.isFailure) {
        return Result.fail(vveCodeResult.errorValue());
    }

    if (!Object.values(compTaskStatus).includes(dto.status as compTaskStatus)) {
        return Result.fail(`Invalid ComplementaryTask status: ${dto.status}`);
    }

    return Result.ok({
        code: codeResult.getValue()!,
        categoryCode: categoryCodeResult.getValue()!,
        vveCode: vveCodeResult.getValue()!,
        team: dto.team,
        status: dto.status as compTaskStatus,
        start: dto.start,
        end: dto.end,
        impactOnOperations: dto.impactOnOperations
    });
}

  public static toDomain(persistence: ICompTaskPersistence): Result<ComplementaryTask> {
    const codeResult = GenericCode.create(persistence.code);
    if (codeResult.isFailure) {
        return Result.fail(codeResult.errorValue());
    }

    const categoryCodeResult = GenericCode.create(persistence.categoryCode);
    if (categoryCodeResult.isFailure) {
        return Result.fail(categoryCodeResult.errorValue());
    }

    const vveCodeResult = VVNCode.create(persistence.vveCode);
    if (vveCodeResult.isFailure) {
        return Result.fail(vveCodeResult.errorValue());
    }

    if (!Object.values(compTaskStatus).includes(persistence.status as compTaskStatus)) {
        return Result.fail(`Invalid ComplementaryTask status: ${persistence.status}`);
    }

    return ComplementaryTask.create(
        {
            code: codeResult.getValue()!,
            categoryCode: categoryCodeResult.getValue()!,
            vveCode: vveCodeResult.getValue()!,
            team: persistence.team,
            status: persistence.status as compTaskStatus,
            start: persistence.start,
            end: persistence.end,
            impactOnOperations: persistence.impactOnOperations
        },
        new UniqueEntityID(persistence.id)
    );
}
  public static toPersistence(ct: ComplementaryTask): ICompTaskPersistence {
  return {
    id: ct.id.toString(),
    code: ct.code.value,
    categoryCode: ct.categoryCode.value,
    vveCode: ct.vveCode.value,
    team: ct.team,
    status: ct.status,
    start: ct.start,
    ...(ct.end !== undefined && { end: ct.end }),
    impactOnOperations: ct.impactOnOperations
  };
}

public static toUpdateProps(dto: ICompTaskUpdateDTO): Result<{
    team?: string;
    status?: compTaskStatus;
    end?: Date | undefined;
  }> {

    const updateProps: {
      categoryId?: UniqueEntityID;
      team?: string;
      status?: compTaskStatus;
      start?: Date;
      end?: Date | undefined;
    } = {};

    if (dto.team !== undefined) {
      updateProps.team = dto.team;
    }

    if (dto.status !== undefined) {
    if (!Object.values(compTaskStatus).includes(dto.status as compTaskStatus)) {
          return Result.fail(`Invalid ComplementaryTask status: ${dto.status}`);
      }
      updateProps.status = dto.status as compTaskStatus;
    }

    if (dto.end !== undefined) {
      updateProps.end = dto.end;
    }

    return Result.ok(updateProps);
  }
}
