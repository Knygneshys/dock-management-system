import { OperationPlan } from '../../domain/entities/OperationPlan';
import { OperationPlanResponseDto } from '../dtos/operation-plan/OperationPlanResponseDto';
import { OperationPlanSummaryDto } from '../dtos/operation-plan/OperationPlanSummaryDto';
import { InterfacePlannedOperationMapper } from './InterfacePlannedOperationMapper';

export class InterfaceOperationPlanMapper {
  public static mapOperationPlanToOperationPlanResponseDto(operationPlan: OperationPlan): OperationPlanResponseDto {
    const plannedOperationDtos = operationPlan.plannedOperations.map((po) =>
      InterfacePlannedOperationMapper.mapPlannedOperationToPlannedOperationDto(po),
    );

    return {
      vvnCode: operationPlan.vvnCode.value,
      dockCode: operationPlan.dockCode,
      craneCodes: operationPlan.craneCodes,
      staffCodes: operationPlan.staffCodes,
      storageAreaCode: operationPlan.storageAreaCode,
      start: operationPlan.start,
      end: operationPlan.end,
      usedAlgorithm: operationPlan.usedAlgorithm,
      creatorUserEmail: operationPlan.creatorUserEmail.value,
      plannedOperations: plannedOperationDtos,
      createdAt: operationPlan.createdAt!,
    };
  }

  public static mapOperationPlanToOperationPlanSummaryDto(operationPlan: OperationPlan): OperationPlanSummaryDto {
    return {
      vvnCode: operationPlan.vvnCode.value,
      dockCode: operationPlan.dockCode,
      craneCode: operationPlan.craneCodes,
      staffCode: operationPlan.staffCodes,
      storageAreaCode: operationPlan.storageAreaCode,
      start: operationPlan.start.toISOString(),
      end: operationPlan.end.toISOString(),

      usedAlgorithm: operationPlan.usedAlgorithm,
      creatorUserEmail: operationPlan.creatorUserEmail.value,
      plannedOperationsCount: operationPlan.plannedOperations.length,
      createdAt: operationPlan.createdAt!,
    };
  }
}
