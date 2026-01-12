import { OperationPlan } from '../../domain/entities/OperationPlan';
import { UserEmail } from '../../domain/object-values/userEmail';
import { VVNCode } from '../../domain/object-values/vvnCode';
import { Mapper } from '../../shared/infra/Mapper';
import { CreateOperationPlanCommand } from '../commands/operation-plan-commands/CreateOperationPlanCommand';
import { IOperationPlanPersistence } from '../dataschema/IOperationPlanPersistance';
import { OperationPlanDto } from '../dto/OperationPlanDto';

export class OperationPlanMapper extends Mapper<OperationPlan> {
  public static mapCreateOperationPlanCommandToOperationPlanDto(command: CreateOperationPlanCommand): OperationPlanDto {
    const userEmailCreationResult = UserEmail.create(command.creatorUserEmail);
    const userEmail = userEmailCreationResult.getValue()!;

    const vvnCodeCreationResult = VVNCode.create(command.vvnCode);
    const vvnCode = vvnCodeCreationResult.getValue()!;

    return {
      vvnCode,
      dockCode: command.dockCode,
      craneCodes: command.craneCodes,
      staffCodes: command.staffCodes,
      storageAreaCode: command.storageAreaCode,
      start: command.start,
      end: command.end,
      usedAlgorithm: command.usedAlgorithm,
      creatorUserEmail: userEmail,
      plannedOperations: command.plannedOperations,
    };
  }

  public static mapOperationPlanDtoToOperationPlan(dto: OperationPlanDto): OperationPlan {
    const operationPlanCreationResult = OperationPlan.create(dto);
    const operationPlan = operationPlanCreationResult.getValue()!;

    return operationPlan;
  }

  public static toPersistance(operationPlan: OperationPlan): IOperationPlanPersistence {
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
      plannedOperations: operationPlan.plannedOperations,
    };
  }

  public static async toDomain(persistance: IOperationPlanPersistence): Promise<OperationPlan> {
    const userEmailOrError = UserEmail.create(persistance.creatorUserEmail);
    const email = userEmailOrError.getValue()!;

    const vvnCodeOrError = VVNCode.create(persistance.vvnCode);
    const vvn = vvnCodeOrError.getValue()!;

    const operationPlan = OperationPlan.create({
      vvnCode: vvn,
      dockCode: persistance.dockCode,
      craneCodes: persistance.craneCodes,
      staffCodes: persistance.staffCodes,
      storageAreaCode: persistance.storageAreaCode,

      start: persistance.start,
      end: persistance.end,

      usedAlgorithm: persistance.usedAlgorithm,
      creatorUserEmail: email,
      plannedOperations: persistance.plannedOperations,

      createdAt: persistance.createdAt ?? null,
    });

    return operationPlan.getValue()!;
  }
}
