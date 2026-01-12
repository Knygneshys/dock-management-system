import { Inject, Service } from 'typedi';
import IOperationPlanService from '../IServices/IOperationPlanService';
import { Result } from '../../shared/logic/Result';
import { CreateOperationPlanCommand } from '../commands/operation-plan-commands/CreateOperationPlanCommand';
import config from '../../../config';
import { OperationPlanMapper } from '../mappers/OperationPlanMapper';
import { OperationPlan } from '../../domain/entities/OperationPlan';
import { UpdateOperationPlanCommand } from '../commands/operation-plan-commands/UpdateOperationPlanCommand';
import { SearchOperationPlansQuery } from '../../interface/dtos/operation-plan/SearchOperationPlansQuery';
import IOperationPlanRepo from '../../domain/IRepos/IOperationPlanRepo';
import { updateVVNStatus } from '../../interface/api/clients/mainBackendClient';

@Service()
export default class OperationPlanService implements IOperationPlanService {
  constructor(@Inject(config.repos.operationPlan.name) private operationPlanRepo: IOperationPlanRepo) {}

  public async getByCode(vvnCode: number): Promise<Result<OperationPlan> | Result<string>> {
    const operationPlan = await this.operationPlanRepo.findByCode(vvnCode);

    if (operationPlan === null) {
      return Result.fail<string>(`An Operation Plan of VVN code: ${vvnCode} does not exist!`);
    }

    return Result.ok<OperationPlan>(operationPlan);
  }

  public async updateOperationPlan(
    vvnCode: number,
    command: UpdateOperationPlanCommand,
  ): Promise<Result<OperationPlan> | Result<string>> {
    const operationPlan = await this.operationPlanRepo.findByCode(vvnCode);

    if (operationPlan === null) {
      return Result.fail<string>(`An Operation Plan of VVN code: ${vvnCode} does not exist!`);
    }

    const operationPlanOrError = operationPlan.update(command);
    if (operationPlanOrError.isFailure) {
      return Result.fail<string>(operationPlanOrError.errorValue());
    }

    const updatedOperationPlan = await this.operationPlanRepo.save(operationPlan);

    return Result.ok<OperationPlan>(updatedOperationPlan);
  }

  public async getAll(): Promise<Result<OperationPlan[]>> {
    const operationPlans = await this.operationPlanRepo.getAll();
    return Result.ok<OperationPlan[]>(operationPlans);
  }

  public async search(query: SearchOperationPlansQuery): Promise<Result<OperationPlan[]>> {
    if (query.from && query.to && query.from.getTime() > query.to.getTime()) {
      return Result.fail<OperationPlan[]>('"from" must be <= "to".');
    }

    const operationPlans = await this.operationPlanRepo.search(query);

    return Result.ok<OperationPlan[]>(operationPlans);
  }

  public async createOperationPlan(command: CreateOperationPlanCommand): Promise<Result<string>> {
    const operationPlanDocument = await this.operationPlanRepo.findByCode(command.vvnCode);

    if (operationPlanDocument !== null) {
      return Result.fail<string>(`An operation plan with code: ${command.vvnCode} already exists!`);
    }

    const operationPlanDto = OperationPlanMapper.mapCreateOperationPlanCommandToOperationPlanDto(command);
    const operationPlan = OperationPlanMapper.mapOperationPlanDtoToOperationPlan(operationPlanDto);

    const result = await this.operationPlanRepo.save(operationPlan);

    try {
      await updateVVNStatus(command.vvnCode);
    } catch (error) {
      console.error('❌ Failed to update VVN status:', error);
    }
    return Result.ok<string>(`${result.vvnCode.value}`);
  }

  public async deleteByDate(date: Date): Promise<Result<void>> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const operationPlans = await this.operationPlanRepo.search({
        from: startOfDay,
        to: endOfDay,
      });
      const vvnCodes = [...new Set(operationPlans.map((op) => op.vvnCode.value))];

      for (const vvnCode of vvnCodes) {
        try {
          await updateVVNStatus(vvnCode);
        } catch (error) {
          console.error(`Failed to toggle VVN ${vvnCode} status:`, error);
        }
      }

      await this.operationPlanRepo.deleteByDate(date);

      return Result.ok();
    } catch (error) {
      console.error('Error deleting operation plans:', error);
      return Result.fail('Failed to delete operation plans');
    }
  }
}
