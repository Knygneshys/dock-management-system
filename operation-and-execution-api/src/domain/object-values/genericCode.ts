import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface GenericCodeProps {
  value: string;
}

export class GenericCode extends ValueObject<GenericCodeProps> {
  get value(): string {
    return this.props.value;
  }
  private constructor(props: GenericCodeProps) {
    super(props);
  }
  public static create(code: string): Result<GenericCode> {
    const guardResult = Guard.againstNullOrUndefined(code, 'code');
    if (!guardResult.succeeded) {
      return Result.fail<GenericCode>(guardResult.message);
    }
    return Result.ok<GenericCode>(new GenericCode({ value: code }));
  }
}
