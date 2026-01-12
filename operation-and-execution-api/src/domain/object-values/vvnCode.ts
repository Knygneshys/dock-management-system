import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface VVNCodeProps {
  value: number;
}

export class VVNCode extends ValueObject<VVNCodeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: VVNCodeProps) {
    super(props);
  }

  public static create(code: number): Result<VVNCode> {
    const guardResult = Guard.againstNullOrUndefined(code, 'code');
    if (!guardResult.succeeded) {
      return Result.fail<VVNCode>(guardResult.message);
    } else {
      return Result.ok<VVNCode>(new VVNCode({ value: code }));
    }
  }
}
