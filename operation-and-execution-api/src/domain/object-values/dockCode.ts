import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface DockCodeProps {
  value: string;
}

export class DockCode extends ValueObject<DockCodeProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: DockCodeProps) {
    super(props);
  }

  public static create(code: string): Result<DockCode> {
    const guardResult = Guard.againstNullOrUndefined(code, 'code');
    if (!guardResult.succeeded) {
      return Result.fail<DockCode>(guardResult.message);
    } else {
      return Result.ok<DockCode>(new DockCode({ value: code }));
    }
  }
}
