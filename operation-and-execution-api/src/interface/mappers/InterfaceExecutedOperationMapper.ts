import { ExecutedOperation } from '../../domain/entities/ExecutedOperation';
import { ExecutedOperationResponseDto } from '../dtos/executed-operation/ExecutedOperationResponseDto';

export class InterfaceExecutedOperationMapper {
  public static mapExecutedOperationToExecutedOperationResponseDto(
    executedOperation: ExecutedOperation,
  ): ExecutedOperationResponseDto {
    return {
      start: executedOperation.start,
      end: executedOperation.end,
      from: executedOperation.from,
      to: executedOperation.to,
      containerId: executedOperation.containerId,
    };
  }
}
