import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Guard } from "../../shared/logic/Guard";
import { Result } from "../../shared/logic/Result";
import { compTaskStatus } from "../enums/compTaskStatus";
import { GenericCode } from "../object-values/genericCode";
import { VVNCode } from "../object-values/vvnCode";

interface ComplementaryTaskProps{
    code: GenericCode;
    categoryCode: GenericCode;
    vveCode: VVNCode;
    team: string;
    status: compTaskStatus;
    start: Date;
    end: Date | undefined;
    impactOnOperations: boolean;
}

export class ComplementaryTask extends AggregateRoot<ComplementaryTaskProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get  code(): GenericCode {
        return this.props.code;
    }

    get categoryCode(): GenericCode{
        return this.props.categoryCode;
    }

    get vveCode(): VVNCode{
        return this.props.vveCode;
    }

    get team(): string{
        return this.props.team;
    }

    get status(): compTaskStatus{
        return this.props.status;
    }

    get start(): Date{
        return this.props.start;
    }

    get end(): Date | undefined{
        return this.props.end;
    }

    get impactOnOperations(): boolean{
        return this.props.impactOnOperations;
    }

    public static create(props: ComplementaryTaskProps, id?: UniqueEntityID): Result<ComplementaryTask>{
        const guardedProps = [
            {argument: props.code, argumentName: 'code'},
            {argument: props.categoryCode, argumentName: 'category'},
            {argument: props.vveCode, argumentName: 'vveId'},
            {argument: props.team, argumentName: 'team'},
            {argument: props.status, argumentName: 'status'},
            {argument: props.start, argumentName: 'start'},
            {argument: props.impactOnOperations, argumentName: 'impactOnOperations'}
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if(!guardResult.succeeded){
            return Result.fail<ComplementaryTask>(guardResult.message);
        }

        if (props.status === compTaskStatus.Completed && !props.end) {
            return Result.fail<ComplementaryTask>('Cannot create completed task without an end timestamp');
        }

        if (props.end !== undefined && props.end < props.start) {
            return Result.fail<ComplementaryTask>('End timestamp cannot be before start timestamp');
        }

        const ctc = new ComplementaryTask({...props}, id);
        return Result.ok<ComplementaryTask>(ctc);
    }

    public update(updates: {
    team?: string;
    status?: compTaskStatus;
    end?: Date | undefined;
}): Result<void> {
    if (updates.status === compTaskStatus.Completed) {
        const endTime = updates.end !== undefined ? updates.end : this.props.end;
        if (!endTime) {
            return Result.fail('Cannot mark task as completed without an end timestamp');
        }
    }
        if (updates.end !== undefined && updates.end < this.props.start) {
        return Result.fail('End timestamp cannot be before start timestamp');
    }
        if (updates.team !== undefined) {
        this.props.team = updates.team;
    }
    
    if (updates.status !== undefined) {
        this.props.status = updates.status;
    }
    
    if (updates.end !== undefined) {
        this.props.end = updates.end;
    }
    
    return Result.ok<void>();
}
}