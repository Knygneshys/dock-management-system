import { VVE } from '../../domain/entities/vve';
import { Mapper } from '../../shared/infra/Mapper';
import { IVVEDTO } from '../dto/vve-dtos/IVVEDTO';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { VVNCode } from '../../domain/object-values/vvnCode';
import { VesselImo } from '../../domain/object-values/vesselImo';
import { UserEmail } from '../../domain/object-values/userEmail';
import { Result } from '../../shared/logic/Result';
import { IVVEPersistence } from '../dataschema/IVVEPersistence';
import { VVEStatus } from '../../domain/enums/vveStatus';
import { DockCode } from '../../domain/object-values/dockCode';
import { ExecutedOperation } from '../../domain/entities/ExecutedOperation';
import { ExecutedOperationMapper } from './ExecutedOperationMapper';
import { IExecutedOperationPersistence } from '../dataschema/IExecutedOperationPersistence';

export class VVEMap extends Mapper<VVE> {
  public static toDTO(vve: VVE): IVVEDTO {
    return {
      code: vve.code.value,
      vvnCode: vve.vvnCode.value,
      vesselImo: vve.vesselImo.value,
      arrivalTime: vve.arrivalTime,
      creatorUserEmail: vve.userEmail.value,
      status: vve.status.toString(),
      dockCode: vve.dockCode.value,
      ...(vve.notes !== undefined ? { notes: vve.notes } : {}),
      ...(vve.updatedAt !== undefined ? { updatedAt: vve.updatedAt } : {}),
    } as IVVEDTO;
  }

  public static toDomainProps(dto: IVVEDTO): Result<{
    code: VVNCode;
    vvnCode: VVNCode;
    vesselImo: VesselImo;
    arrivalTime: Date;
    creatorUserEmail: UserEmail;
    status: VVEStatus;
    dockCode: DockCode;
    executedOperations: ExecutedOperation[];
  }> {
    if (
      dto.code === undefined ||
      dto.vvnCode === undefined ||
      !dto.vesselImo ||
      !dto.arrivalTime ||
      !dto.creatorUserEmail ||
      !dto.status ||
      !dto.dockCode
    ) {
      return Result.fail('Missing required fields in DTO');
    }

    const vveCodeResult = VVNCode.create(dto.code);
    if (vveCodeResult.isFailure) {
      return Result.fail(`VVNCode: ${vveCodeResult.errorValue()}`);
    }

    const vvnCodeResult = VVNCode.create(dto.vvnCode);
    if (vvnCodeResult.isFailure) {
      return Result.fail(`VVNCode: ${vvnCodeResult.errorValue()}`);
    }

    const vesselImoResult = VesselImo.create(dto.vesselImo);
    if (vesselImoResult.isFailure) {
      return Result.fail(`Vessel IMO: ${vesselImoResult.errorValue()}`);
    }

    const emailResult = UserEmail.create(dto.creatorUserEmail);
    if (emailResult.isFailure) {
      return Result.fail(`Email: ${emailResult.errorValue()}`);
    }

    const statusResult = this.validateVVEStatus(dto.status);
    if (statusResult.isFailure) {
      return Result.fail(`Status: ${statusResult.errorValue()}`);
    }

    const dockCodeResult = DockCode.create(dto.dockCode);
    if (dockCodeResult.isFailure) {
      return Result.fail(`Dock Code: ${dockCodeResult.errorValue()}`);
    }

    return Result.ok({
      code: vveCodeResult.getValue()!,
      vvnCode: vvnCodeResult.getValue()!,
      vesselImo: vesselImoResult.getValue()!,
      arrivalTime: dto.arrivalTime,
      creatorUserEmail: emailResult.getValue()!,
      status: statusResult.getValue()!,
      dockCode: dockCodeResult.getValue()!,
      executedOperations: [],
    });
  }

  public static toDomain(props: {
    code: number;
    vvnCode: number;
    vesselImo: string;
    arrivalTime: Date;
    creatorUserEmail: string;
    status: VVEStatus;
    dockCode: string;
    notes?: string[];
    executedOperations: IExecutedOperationPersistence[];
    updatedAt?: Date;
  }): Result<VVE> {
    const vveCodeOrError = VVNCode.create(props.code);
    const vvnCodeOrError = VVNCode.create(props.vvnCode);
    const vesselImoOrError = VesselImo.create(props.vesselImo);
    const creatorUserEmailOrError = UserEmail.create(props.creatorUserEmail);
    const dockCodeOrError = DockCode.create(props.dockCode);

    const combinedResult = Result.combine([
      vveCodeOrError,
      vvnCodeOrError,
      vesselImoOrError,
      creatorUserEmailOrError,
      dockCodeOrError,
    ]);

    if (combinedResult.isFailure) {
      return Result.fail<VVE>(combinedResult.errorValue());
    }

    const executedOperations = props.executedOperations.map((op) => ExecutedOperationMapper.toDomain(op));

    const vveOrError = VVE.create(
      {
        code: vveCodeOrError.getValue()!,
        vvnCode: vvnCodeOrError.getValue()!,
        vesselImo: vesselImoOrError.getValue()!,
        arrivalTime: props.arrivalTime,
        creatorUserEmail: creatorUserEmailOrError.getValue()!,
        status: props.status,
        dockCode: dockCodeOrError.getValue()!,
        executedOperations: executedOperations,
        ...(props.notes !== undefined ? { notes: props.notes } : {}),
        ...(props.updatedAt !== undefined ? { updatedAt: props.updatedAt } : {}),
      },
      new UniqueEntityID(props.vvnCode.toString()),
    );

    return vveOrError;
  }

  public static toPersistence(vve: VVE): IVVEPersistence {
    const executedOperations = vve.executedOperations.map((op) => ExecutedOperationMapper.toPersistence(op));

    return {
      code: vve.code.value,
      vvnCode: vve.vvnCode.value,
      vesselImo: vve.vesselImo.value,
      arrivalTime: vve.arrivalTime,
      creatorUserEmail: vve.userEmail.value,
      status: vve.status,
      dockCode: vve.dockCode.value,
      executedOperations: executedOperations,
      ...(vve.notes !== undefined ? { notes: vve.notes } : {}),
      ...(vve.updatedAt !== undefined ? { updatedAt: vve.updatedAt } : {}),
    };
  }

  private static validateVVEStatus(status: string): Result<VVEStatus> {
    const vveStatus = Object.values(VVEStatus).find((value) => value === status) as VVEStatus;
    if (!vveStatus) {
      const validValues = Object.values(VVEStatus).join(', ');
      return Result.fail(`Invalid status. Must be one of: ${validValues}`);
    }
    return Result.ok(vveStatus);
  }
}
