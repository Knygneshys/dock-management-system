import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { VVEStatus } from '../enums/vveStatus';
import { UserEmail } from '../object-values/userEmail';
import { VesselImo } from '../object-values/vesselImo';
import { VVNCode } from '../object-values/vvnCode';
import { Result } from '../../shared/logic/Result';
import { Guard } from '../../shared/logic/Guard';
import { DockCode } from '../object-values/dockCode';
import { ExecutedOperation } from './ExecutedOperation';

interface VVEProps {
  code: VVNCode;
  vvnCode: VVNCode;
  vesselImo: VesselImo;
  arrivalTime: Date;
  creatorUserEmail: UserEmail;
  status: VVEStatus;
  dockCode: DockCode;
  notes?: string[];
  executedOperations: ExecutedOperation[];
  updatedAt?: Date;
}

export class VVE extends AggregateRoot<VVEProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get code(): VVNCode {
    return this.props.code;
  }

  get userEmail(): UserEmail {
    return this.props.creatorUserEmail;
  }

  get vvnCode(): VVNCode {
    return this.props.vvnCode;
  }

  get vesselImo(): VesselImo {
    return this.props.vesselImo;
  }

  get arrivalTime(): Date {
    return this.props.arrivalTime;
  }

  get status(): VVEStatus {
    return this.props.status;
  }

  get dockCode(): DockCode {
    return this.props.dockCode;
  }

  get notes(): string[] | undefined {
    return this.props.notes;
  }

  get executedOperations(): ExecutedOperation[] {
    return this.props.executedOperations;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  public conclude(): Result<void> {
    if (this.props.status !== VVEStatus.InProgress) {
      return Result.fail('Only VVEs in progress can be concluded');
    }
    this.props.status = VVEStatus.Concluded;
    //TODO implement domain event
    //this.addDomainEvent()
    return Result.ok();
  }

  private constructor(props: VVEProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: VVEProps, id?: UniqueEntityID): Result<VVE> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.arrivalTime, argumentName: 'arrivalTime' },
      { argument: props.creatorUserEmail, argumentName: 'creatorUserEmail' },
      { argument: props.vesselImo, argumentName: 'vesselImo' },
      { argument: props.vvnCode, argumentName: 'vvnCode' },
      { argument: props.status, argumentName: 'status' },
      { argument: props.dockCode, argumentName: 'dockCode' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<VVE>(guardResult.message);
    }
    const vve = new VVE({ ...props }, id);
    return Result.ok<VVE>(vve);
  }

  public updateBerthTime(time: Date): Result<void> {
    if (this.props.status !== VVEStatus.InProgress) {
      return Result.fail('Only in-progress VVEs can be updated');
    }

    this.props.arrivalTime = time;
    this.props.updatedAt = new Date();

    return Result.ok();
  }

  public alterDockOfBerth(dockCode: DockCode): Result<void> {
    if (this.props.status !== VVEStatus.InProgress) {
      return Result.fail('Only in-progress VVEs can be updated');
    }

    this.props.dockCode = dockCode;
    this.props.updatedAt = new Date();

    return Result.ok();
  }
}
