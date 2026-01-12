import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { Guard } from '../../shared/logic/Guard';
import { Result } from '../../shared/logic/Result';
import { UpdateIncidentTypeCommand } from '../../use-cases/commands/incident-type/UpdateIncidentTypeCommand';
import { SeverityClassification } from '../enums/severityClassification';
import { GenericCode } from '../object-values/genericCode';

interface IncidentTypeProps {
  code: GenericCode;
  name: string;
  description: string;
  severity: SeverityClassification;
  parentIncidentTypeCode: string | null;
}

export class IncidentType extends AggregateRoot<IncidentTypeProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get code(): GenericCode {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get severity(): SeverityClassification {
    return this.props.severity;
  }

  get parentIncidentTypeCode(): string | null {
    if (this.props.parentIncidentTypeCode === undefined) {
      return null;
    }

    return this.props.parentIncidentTypeCode;
  }

  private constructor(props: IncidentTypeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: IncidentTypeProps, id?: UniqueEntityID): Result<IncidentType> {
    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.severity, argumentName: 'severity' },
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<IncidentType>(guardResult.message || '');
    }

    const incidentType = new IncidentType({ ...props }, id);
    return Result.ok<IncidentType>(incidentType);
  }

  public update(command: UpdateIncidentTypeCommand): Result<string> {
    this.props.name = command.name;
    this.props.description = command.description;
    this.props.severity = command.severity;
    this.props.parentIncidentTypeCode = command.parentIncidentTypeCode;

    return Result.ok();
  }
}
