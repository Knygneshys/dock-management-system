import { ComplementaryTaskCategory } from '../../domain/entities/complementaryTaskCategory';
import { GenericCode } from '../../domain/object-values/genericCode';
import { Time } from '../../domain/object-values/time';
import { Mapper } from '../../shared/infra/Mapper';
import { Result } from '../../shared/logic/Result';
import { ICompTaskCategoryPersistence } from '../dataschema/ICompTaskCategoryPersistence';
import { ICompTaskCategoryDTO } from '../dto/ICompTaskCategoryDTO';

export class CompTaskCategoryMap extends Mapper<ComplementaryTaskCategory> {
  public static toDTO(ctc: ComplementaryTaskCategory): ICompTaskCategoryDTO {
    if (ctc.defaultDelay !== undefined) {
      const time = {
        hour: ctc.defaultDelay.hour,
        minute: ctc.defaultDelay.minute,
      };
      return {
        code: ctc.code.value,
        name: ctc.name,
        description: ctc.description,
        defaultDelay: time,
      };
    }
    return {
      code: ctc.code.value,
      name: ctc.name,
      description: ctc.description,
    };
  }

  public static toDomainPropos(dto: ICompTaskCategoryDTO): Result<{
    code: GenericCode;
    name: string;
    description: string;
    defaultDelay: Time | undefined;
  }> {
    if (dto.code === undefined || dto.name === undefined || dto.description === undefined) {
      return Result.fail('Missing required fields in DTO');
    }

    const codeResult = GenericCode.create(dto.code);
    if (codeResult.isFailure) {
      return Result.fail(`CTC Code: ${codeResult.errorValue()}`);
    }

    let defaultDelay: Time | undefined = undefined;
    if (dto.defaultDelay !== undefined) {
      const timeResult = Time.create({ hour: dto.defaultDelay.hour, minute: dto.defaultDelay.minute });
      if (timeResult.isFailure) {
        return Result.fail(timeResult.errorValue());
      }
      defaultDelay = timeResult.getValue();
    }

    return Result.ok({
      code: codeResult.getValue() as GenericCode,
      name: dto.name,
      description: dto.description,
      defaultDelay: defaultDelay,
    });
  }

  public static toDomain(props: ICompTaskCategoryPersistence): Result<ComplementaryTaskCategory> {
    const codeResult = GenericCode.create(props.code);
    if (codeResult.isFailure) {
      return Result.fail(`CTC Code: ${codeResult.errorValue()}`);
    }

    let defaultDelay: Time | undefined = undefined;
    if (props.defaultDelay !== undefined) {
      const timeResult = Time.create({ hour: props.defaultDelay.hour, minute: props.defaultDelay.minute });
      if (timeResult.isFailure) {
        return Result.fail(timeResult.errorValue());
      }
      defaultDelay = timeResult.getValue();
    }

    return ComplementaryTaskCategory.create({
      code: codeResult.getValue()!,
      name: props.name,
      description: props.description,
      defaultDelay: defaultDelay,
    });
  }

  public static toPersistence(ctc: ComplementaryTaskCategory): ICompTaskCategoryPersistence {
    return {
      code: ctc.code.value,
      name: ctc.name,
      description: ctc.description,
      ...(ctc.defaultDelay && {
        defaultDelay: {
          hour: ctc.defaultDelay.hour,
          minute: ctc.defaultDelay.minute,
        },
      }),
    };
  }
}
