import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { IncidentStatus } from '../enums/incidentStatus';
import { GenericCode } from '../object-values/genericCode';
import { Time } from '../object-values/time';
import { UserEmail } from '../object-values/userEmail';
import { IncidentType } from './incidentType';
import { VVE } from './vve';

interface IncidentProps {
  code: GenericCode;
  type: IncidentType;
  start: Date;
  end: Date | undefined;
  description: string;
  responsibleUserEmail: UserEmail;
  status: IncidentStatus;
  afectedVVEs: VVE[];
  duration: Time | undefined;
}

export class Incident extends AggregateRoot<IncidentProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get code(): GenericCode {
    return this.props.code;
  }

  get type(): IncidentType {
    return this.props.type;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date | undefined {
    return this.props.end;
  }

  get description(): string {
    return this.props.description;
  }

  get responsibleUserEmail(): UserEmail {
    return this.props.responsibleUserEmail;
  }

  get status(): IncidentStatus {
    return this.props.status;
  }

  get afectedVVEs(): VVE[] {
    return this.props.afectedVVEs;
  }

  get duration(): Time | undefined {
    return this.props.duration;
  }

  public resolve(): Result<void> {
    if (this.props.status === IncidentStatus.Resolved) {
      return Result.fail('Incident already resolved');
    }
    this.props.status = IncidentStatus.Resolved;
    this.props.end = new Date();
    const durationMs = this.props.end.getTime() - this.props.start.getTime();
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const timeResult = Time.create({ hour: hours, minute: minutes });
    if (timeResult.isFailure) {
      return Result.fail(timeResult.errorValue());
    }

    this.props.duration = timeResult.getValue();

    return Result.ok();
  }

  public associateVVE(vve: VVE): Result<void> {
    this.props.afectedVVEs.push(vve);

    return Result.ok();
  }

  public detachVVE(vve: VVE): Result<void> {
    const index = this.props.afectedVVEs.indexOf(vve);

    if (index <= -1) {
      return Result.fail('VVE not affected by this incident.');
    }

    this.props.afectedVVEs.splice(index, 1);
    return Result.ok();
  }

  private constructor(props: IncidentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: IncidentProps, id?: UniqueEntityID): Result<Incident> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.type, argumentName: 'type' },
      { argument: props.start, argumentName: 'start' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.responsibleUserEmail, argumentName: 'responsibleUserEmail' },
      { argument: props.status, argumentName: 'status' },
      { argument: props.afectedVVEs, argumentName: 'afectedVVEs' },
      ...(props.end !== undefined ? [{ argument: props.end, argumentName: 'end' }] : []),
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Incident>(guardResult.message || '');
    }

    const incident = new Incident({ ...props }, id);
    return Result.ok<Incident>(incident);
  }
}
