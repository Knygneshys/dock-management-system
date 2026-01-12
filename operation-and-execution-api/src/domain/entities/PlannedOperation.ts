import { Entity } from '../../shared/domain/Entity';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { ContainerPosition } from '../object-values/ContainerPosition';

interface PlannedOperationProps {
  start: string;
  end: string;
  from: ContainerPosition;
  to: ContainerPosition;
  containerId: string;
}

export class PlannedOperation extends Entity<PlannedOperationProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get start(): string {
    return this.props.start;
  }

  get end(): string {
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

  private constructor(props: PlannedOperationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PlannedOperationProps, id?: UniqueEntityID): Result<PlannedOperation> {
    const guardedProps = [
      { argument: props.start, argumentName: 'start' },
      { argument: props.end, argumentName: 'end' },
      { argument: props.from, argumentName: 'from' },
      { argument: props.to, argumentName: 'to' },
      { argument: props.containerId, argumentName: 'containerId' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PlannedOperation>(guardResult.message);
    }

    const plannedOperation = new PlannedOperation({ ...props }, id);

    return Result.ok<PlannedOperation>(plannedOperation);
  }
}
