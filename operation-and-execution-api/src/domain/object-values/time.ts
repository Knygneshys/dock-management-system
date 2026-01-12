import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface TimeProps {
  hour: number;
  minute: number;
}

export class Time extends ValueObject<TimeProps> {
  get value(): number[] {
    return [this.props.hour, this.props.minute];
  }

  get hour(): number {
    return this.props.hour;
  }

  get minute(): number {
    return this.props.minute;
  }

  private constructor(props: TimeProps) {
    super(props);
  }

  public static create(props: TimeProps): Result<Time> {
    let guardResult = Guard.againstNullOrUndefined(props.hour, 'hour');
    if (!guardResult.succeeded) {
      return Result.fail<Time>(guardResult.message);
    }
    guardResult = Guard.againstNullOrUndefined(props.minute, 'minute');
    if (!guardResult.succeeded) {
      return Result.fail<Time>(guardResult.message);
    }
    guardResult = Guard.inRange(props.hour, 0, 9999, 'hour');
    if (!guardResult.succeeded) {
      return Result.fail<Time>(guardResult.message);
    }
    guardResult = Guard.inRange(props.minute, 0, 59, 'minute');
    if (!guardResult.succeeded) {
      return Result.fail<Time>(guardResult.message);
    }
    if (props.hour === 0 && props.minute === 0) {
      return Result.fail<Time>('Time has to be greater than 0');
    }

    return Result.ok<Time>(new Time(props));
  }
}
