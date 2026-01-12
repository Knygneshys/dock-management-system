import { Inject, Service } from 'typedi';
import IVVEService from '../IServices/IVVEService';
import config from '../../../config';
import IVVERepo from '../../domain/IRepos/IVVERepo';
import { Result } from '../../shared/logic/Result';
import { IVVEDTO } from '../dto/vve-dtos/IVVEDTO';
import { VVE } from '../../domain/entities/vve';
import { VVEMap } from '../mappers/VVEMap';
import { VVEStatus } from '../../domain/enums/vveStatus';
import { VVNCode } from '../../domain/object-values/vvnCode';
import IOperationPlanRepo from '../../domain/IRepos/IOperationPlanRepo';
import { VesselImo } from '../../domain/object-values/vesselImo';
import { IUpdateVVEDTO } from '../dto/vve-dtos/IUpdateVVEDTO';
import { DockCode } from '../../domain/object-values/dockCode';
import { ExecutedOperation } from '../../domain/entities/ExecutedOperation';
import { CreateExecutedOperationCommand } from '../commands/executed-operation/CreateExecutedOperationCommand';

@Service()
export default class VVEService implements IVVEService {
  constructor(
    @Inject(config.repos.vve.name) private vveRepo: IVVERepo,
    @Inject(config.repos.operationPlan.name) private operationPlanRepo: IOperationPlanRepo,
  ) {}

  public async getExecutedOperations(code: number): Promise<Result<ExecutedOperation[]>> {
    const vvnCode = VVNCode.create(code);

    if (vvnCode.isFailure) {
      return Result.fail(`Failed to create code: ${code}`);
    }

    const vve = await this.vveRepo.findByDomainId(vvnCode.getValue()!);

    if (!vve) {
      return Result.fail('VVE not found');
    }

    return Result.ok<ExecutedOperation[]>(vve.executedOperations);
  }

  public async addExecutedOperation(code: number, command: CreateExecutedOperationCommand): Promise<Result<IVVEDTO>> {
    const vvnCode = VVNCode.create(code);

    if (vvnCode.isFailure) {
      return Result.fail(`Failed to create code: ${code}`);
    }

    const vve = await this.vveRepo.findByDomainId(vvnCode.getValue()!);

    if (!vve) {
      return Result.fail('VVE not found');
    }

    const executedOperationOrError = ExecutedOperation.create(command);

    if (executedOperationOrError.isFailure) {
      return Result.fail('Failed to  create executed operation');
    }

    const executedOperation = executedOperationOrError.getValue()!;

    vve.executedOperations.push(executedOperation);

    const resultingVve = await this.vveRepo.save(vve);

    const vveDTOResult = VVEMap.toDTO(resultingVve) as IVVEDTO;

    return Result.ok<IVVEDTO>(vveDTOResult);
  }

  public async createVve(vveDTO: IVVEDTO): Promise<Result<IVVEDTO>> {
    vveDTO.code = vveDTO.vvnCode;
    vveDTO.status = VVEStatus.InProgress;

    const propsOrError = VVEMap.toDomainProps(vveDTO);
    if (propsOrError.isFailure) {
      return Result.fail<IVVEDTO>(propsOrError.errorValue());
    }

    if (!vveDTO.dockCode) {
      return Result.fail<IVVEDTO>('actualDockId is required');
    }

    const code = propsOrError.getValue()!.code;
    const exists = await this.vveRepo.findByDomainId(code);
    if (exists) {
      return Result.fail<IVVEDTO>(`VVE with associated VVN n.${code.value} already exists!`);
    }

    const vveOrError = VVE.create(propsOrError.getValue()!);

    if (vveOrError.isFailure) {
      return Result.fail<IVVEDTO>(vveOrError.errorValue());
    }

    const vveResult = vveOrError.getValue();

    await this.vveRepo.save(vveResult!);

    const vveDTOResult = VVEMap.toDTO(vveResult!) as IVVEDTO;

    return Result.ok<IVVEDTO>(vveDTOResult);
  }

  public async getAllVves(): Promise<Result<IVVEDTO[]>> {
    try {
      const vves = await this.vveRepo.getAll();

      if (!vves || vves.length === 0) {
        return Result.ok<IVVEDTO[]>([]);
      }

      const vveDTOs: IVVEDTO[] = [];
      const errors: string[] = [];

      for (const vve of vves) {
        try {
          const dto = VVEMap.toDTO(vve) as IVVEDTO;
          vveDTOs.push(dto);
        } catch (mapperError) {
          errors.push(`Failed to map VVE ${vve.code.value}: ${mapperError}`);
        }
      }

      if (errors.length > 0) {
        console.warn('Some VVEs failed to map to DTO:', errors.join('; '));
      }

      return Result.ok<IVVEDTO[]>(vveDTOs);
    } catch (e) {
      return Result.fail<IVVEDTO[]>(e);
    }
  }

  public async updateVVE(dto: IUpdateVVEDTO): Promise<Result<IVVEDTO>> {
    const vvnCodeResult = VVNCode.create(dto.code);
    if (vvnCodeResult.isFailure) {
      return Result.fail(vvnCodeResult.errorValue());
    }

    const vve = await this.vveRepo.findByDomainId(vvnCodeResult.getValue()!);
    if (!vve) {
      return Result.fail('VVE not found');
    }

    if ((!dto.dockCode || dto.dockCode === undefined) && (!dto.arrivalTime || dto.arrivalTime === undefined)) {
      return Result.fail('Insert at least one update field!');
    }

    if (dto.dockCode) {
      const dockCodeResult = DockCode.create(dto.dockCode);
      if (dockCodeResult.isFailure) {
        return Result.fail(dockCodeResult.errorValue());
      }

      const updateDockResult = vve.alterDockOfBerth(dockCodeResult.getValue()!);
      if (updateDockResult.isFailure) {
        return Result.fail(updateDockResult.errorValue());
      }
    }

    if (dto.arrivalTime) {
      const updateBerthTimeResult = vve.updateBerthTime(dto.arrivalTime);
      if (updateBerthTimeResult.isFailure) {
        return Result.fail(updateBerthTimeResult.errorValue());
      }
    }

    await this.vveRepo.save(vve);

    return Result.ok(VVEMap.toDTO(vve));
  }

  public async search(start?: Date, end?: Date, vesselImo?: VesselImo, status?: VVEStatus): Promise<Result<IVVEDTO[]>> {
    const vves = await this.vveRepo.search(start, vesselImo, status);

    if (!vves || vves.length === 0) {
      return Result.ok([]);
    }

    const vvesDto = vves.map((vve) => VVEMap.toDTO(vve));

    return Result.ok(vvesDto);
  }
}
