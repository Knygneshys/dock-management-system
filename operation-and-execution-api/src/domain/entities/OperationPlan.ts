import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { UpdateOperationPlanCommand } from '../../use-cases/commands/operation-plan-commands/UpdateOperationPlanCommand';
import { AlgorithmTypes } from '../enums/algorithmTypes';
import { UserEmail } from '../object-values/userEmail';
import { VVNCode } from '../object-values/vvnCode';
import { PlannedOperation } from './PlannedOperation';

interface OperationPlanProps {
  vvnCode: VVNCode;
  dockCode: string;
  craneCodes: string[];
  staffCodes: number[];
  storageAreaCode: string;
  start: Date;
  end: Date;
  usedAlgorithm: AlgorithmTypes;
  creatorUserEmail: UserEmail;
  plannedOperations: PlannedOperation[];
  createdAt?: string | null;
  isRegenerated?: boolean;
  regeneratedAt?: Date | null;
}

export class OperationPlan extends AggregateRoot<OperationPlanProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get vvnCode(): VVNCode {
    return this.props.vvnCode;
  }

  get dockCode(): string {
    return this.props.dockCode;
  }

  get craneCodes(): string[] {
    return this.props.craneCodes;
  }

  get staffCodes(): number[] {
    return this.props.staffCodes;
  }

  get storageAreaCode(): string {
    return this.props.storageAreaCode;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  get usedAlgorithm(): AlgorithmTypes {
    return this.props.usedAlgorithm;
  }

  get creatorUserEmail(): UserEmail {
    return this.props.creatorUserEmail;
  }

  get plannedOperations(): PlannedOperation[] {
    return this.props.plannedOperations;
  }

  get createdAt(): string | null {
    const createdAt = this.props.createdAt;
    if (createdAt) {
      return createdAt;
    }

    return null;
  }

  get isRegenerated(): boolean {
    return this.props.isRegenerated ?? false;
  }

  get regeneratedAt(): Date | null {
    return this.props.regeneratedAt ?? null;
  }

  private constructor(props: OperationPlanProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OperationPlanProps, id?: UniqueEntityID): Result<OperationPlan> {
    const guardedProps = [
      { argument: props.vvnCode, argumentName: 'vvnCode' },
      { argument: props.dockCode, argumentName: 'dockCode' },
      { argument: props.craneCodes, argumentName: 'craneCode' },
      { argument: props.staffCodes, argumentName: 'staffCode' },
      { argument: props.storageAreaCode, argumentName: 'storageAreaCode' },
      { argument: props.start, argumentName: 'start' },
      { argument: props.end, argumentName: 'end' },
      { argument: props.usedAlgorithm, argumentName: 'usedAlgorithm' },
      { argument: props.creatorUserEmail, argumentName: 'creatorUserEmail' },
      { argument: props.plannedOperations, argumentName: 'plannedOperations' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<OperationPlan>(guardResult.message);
    }

    const operationPlan = new OperationPlan({ ...props }, id);

    return Result.ok<OperationPlan>(operationPlan);
  }

  public update(command: UpdateOperationPlanCommand): Result<string> {
    const userEmailOrError = UserEmail.create(command.creatorUserEmail);

    if (userEmailOrError.isFailure) {
      return Result.fail<string>(`Failed to create user email : '${command.creatorUserEmail}'`);
    }

    const startDate = new Date(command.start);
    const endDate = new Date(command.end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return Result.fail<string>('Invalid start or end date');
    }

    if (startDate.getTime() > endDate.getTime()) {
      return Result.fail<string>('Start is after end');
    }

    if (startDate.getTime() === endDate.getTime()) {
      return Result.fail<string>('Both start and end times are identical');
    }

    this.props.dockCode = command.dockCode;
    this.props.craneCodes = command.craneCodes;
    this.props.staffCodes = command.staffCodes;
    this.props.storageAreaCode = command.storageAreaCode;
    this.props.start = startDate;
    this.props.end = endDate;
    this.props.usedAlgorithm = command.usedAlgorithm;
    this.props.creatorUserEmail = userEmailOrError.getValue()!;
    this.props.plannedOperations = command.plannedOperations;

    return Result.ok();
  }
}
