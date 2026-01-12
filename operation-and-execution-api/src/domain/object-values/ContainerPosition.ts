import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface ContainerPositionProps {
  bay: number;
  row: number;
  tier: number;
}

export class ContainerPosition extends ValueObject<ContainerPositionProps> {
  get bay(): number {
    return this.props.bay;
  }

  get row(): number {
    return this.props.row;
  }

  get tier(): number {
    return this.props.tier;
  }

  private constructor(props: ContainerPositionProps) {
    super(props);
  }

  public static create(props: ContainerPositionProps): Result<ContainerPosition> {
    const guardedProps = [
      { argument: props.bay, argumentName: 'bay' },
      { argument: props.row, argumentName: 'row' },
      { argument: props.tier, argumentName: 'tier' },
    ];

    let guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ContainerPosition>(guardResult.message);
    }

    guardResult = Guard.inRange(props.bay, 0, Math.max(), 'bay');
    if (!guardResult.succeeded) {
      return Result.fail<ContainerPosition>(guardResult.message);
    }
    guardResult = Guard.inRange(props.row, 0, Math.max(), 'row');
    if (!guardResult.succeeded) {
      return Result.fail<ContainerPosition>(guardResult.message);
    }
    guardResult = Guard.inRange(props.tier, 0, Math.max(), 'tier');
    if (!guardResult.succeeded) {
      return Result.fail<ContainerPosition>(guardResult.message);
    }

    return Result.ok<ContainerPosition>(new ContainerPosition(props));
  }
}
