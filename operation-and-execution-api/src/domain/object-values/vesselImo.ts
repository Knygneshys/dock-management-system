import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';

interface VesselImoProps {
  value: string;
}

export class VesselImo extends ValueObject<VesselImoProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: VesselImoProps) {
    super(props);
  }

  public static create(imo: string): Result<VesselImo> {
    const guardResult = Guard.againstNullOrUndefined(imo, 'imo');
    if (!guardResult.succeeded) {
      return Result.fail<VesselImo>(guardResult.message);
    } else {
      return Result.ok<VesselImo>(new VesselImo({ value: imo }));
    }
  }
}