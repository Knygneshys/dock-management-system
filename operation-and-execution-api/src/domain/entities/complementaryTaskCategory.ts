import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { GenericCode } from '../object-values/genericCode';
import { Time } from '../object-values/time';

interface ComplementaryTaskCategoryProps {
  code: GenericCode;
  name: string;
  description: string;
  defaultDelay: Time | undefined;
}

export class ComplementaryTaskCategory extends AggregateRoot<ComplementaryTaskCategoryProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get code(): GenericCode {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get defaultDelay(): Time | undefined {
    return this.props.defaultDelay;
  }

  private constructor(props: ComplementaryTaskCategoryProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ComplementaryTaskCategoryProps, id?: UniqueEntityID): Result<ComplementaryTaskCategory> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName: 'description' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ComplementaryTaskCategory>(guardResult.message);
    }

    const ctc = new ComplementaryTaskCategory({ ...props }, id);
    return Result.ok<ComplementaryTaskCategory>(ctc);
  }
}
