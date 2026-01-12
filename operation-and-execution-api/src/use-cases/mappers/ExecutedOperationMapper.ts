import { ExecutedOperation } from '../../domain/entities/ExecutedOperation';
import { Mapper } from '../../shared/infra/Mapper';
import { IExecutedOperationPersistence } from '../dataschema/IExecutedOperationPersistence';

export class ExecutedOperationMapper extends Mapper<ExecutedOperation> {
  public static toPersistence(executedOperation: ExecutedOperation): IExecutedOperationPersistence {
    return {
      start: executedOperation.start,
      end: executedOperation.end,
      from: executedOperation.from,
      to: executedOperation.to,
      containerId: executedOperation.containerId,
    };
  }

  public static toDomain(persistence: IExecutedOperationPersistence): ExecutedOperation {
    const executedOperationOrError = ExecutedOperation.create({
      start: persistence.start,
      end: persistence.end,
      from: persistence.from,
      to: persistence.to,
      containerId: persistence.containerId,
    });

    return executedOperationOrError.getValue()!;
  }
}
