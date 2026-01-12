import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { GenericCode } from '../object-values/genericCode';
import { VVNCode } from '../object-values/vvnCode';

interface VisitIncidentProps {
  code: GenericCode;
  incidentCode: GenericCode;
  visitCode: VVNCode;
}

export class VisitIncident extends AggregateRoot<VisitIncidentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get code(): GenericCode {
    return this.props.code;
  }

  get incidentCode(): GenericCode {
    return this.props.incidentCode;
  }

  get visitCode(): VVNCode {
    return this.props.visitCode;
  }

  private constructor(props: VisitIncidentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: VisitIncidentProps, id?: UniqueEntityID) {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.incidentCode, argumentName: 'incidentCode' },
      { argument: props.visitCode, argumentName: 'visitCode' },
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<VisitIncident>(guardResult.message || '');
    }

    const visitIncident = new VisitIncident({ ...props }, id);
    return Result.ok<VisitIncident>(visitIncident);
  }
}
