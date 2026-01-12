import { PlannedOperation } from '../../domain/entities/PlannedOperation';
import { PlannedOperationDto } from '../dtos/planned-operation/PlannedOperationDto';

export class InterfacePlannedOperationMapper {
  public static mapPlannedOperationToPlannedOperationDto(plannedOperation: PlannedOperation): PlannedOperationDto {
    return {
      start: plannedOperation.start,
      end: plannedOperation.end,
      from: plannedOperation.from,
      to: plannedOperation.to,
      containerId: plannedOperation.containerId,
    };
  }
}
