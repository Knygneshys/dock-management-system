import { Entity } from '../../shared/domain/Entity';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { ContainerPosition } from '../object-values/ContainerPosition';

interface ExecutedOperationProps {
  start: Date;
  end: Date;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
}

export class ExecutedOperation extends Entity<ExecutedOperationProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  get from(): ContainerPosition {
    return this.props.from;
  }

  get to(): ContainerPosition {
    return this.props.to;
  }

  get containerId(): string {
    return this.props.containerId;
  }

  private constructor(props: ExecutedOperationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ExecutedOperationProps, id?: UniqueEntityID): Result<ExecutedOperation> {
    const guardedProps = [
      { argument: props.start, argumentName: 'start' },
      { argument: props.end, argumentName: 'end' },
      { argument: props.from, argumentName: 'from' },
      { argument: props.to, argumentName: 'to' },
      { argument: props.containerId, argumentName: 'containerId' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ExecutedOperation>(guardResult.message);
    }

    const plannedOperation = new ExecutedOperation({ ...props }, id);

    return Result.ok<ExecutedOperation>(plannedOperation);
  }
}
