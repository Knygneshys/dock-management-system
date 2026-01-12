import { Inject, Service } from 'typedi';
import { Model } from 'mongoose';
import IOperationPlanRepo from '../../../domain/IRepos/IOperationPlanRepo';
import { IOperationPlanPersistence } from '../../../use-cases/dataschema/IOperationPlanPersistance';
import { OperationPlan } from '../../../domain/entities/OperationPlan';
import { operationPlanSchemaDependencyInjection } from '../../../shared/domain/constants/dependency-injection-strings';
import { OperationPlanMapper } from '../../../use-cases/mappers/OperationPlanMapper';
import { VVNCode } from '../../../domain/object-values/vvnCode';
import {
  OperationPlanSortBy,
  SearchOperationPlansQuery,
} from '../../../interface/dtos/operation-plan/SearchOperationPlansQuery';

@Service()
export default class OperationPlanRepo implements IOperationPlanRepo {
  constructor(
    @Inject(operationPlanSchemaDependencyInjection)
    private OperationPlanSchema: Model<IOperationPlanPersistence & Document>,
  ) {}

  public async findByCode(vvnCode: number): Promise<OperationPlan | null> {
    const query = { vvnCode: vvnCode };
    const operationPlanDocument = await this.OperationPlanSchema.findOne(query);

    if (operationPlanDocument === null) {
      return null;
    }

    return OperationPlanMapper.toDomain(operationPlanDocument);
  }

  public async getDockCodeByVVNCode(vvnCode: VVNCode): Promise<string | null> {
    const record = await this.OperationPlanSchema.findOne({ vvnCode: vvnCode.value });

    if (!record) return null;
    return record.dockCode ?? null;
  }

  public async getAll(): Promise<OperationPlan[]> {
    const operationPlanDocuments = await this.OperationPlanSchema.find();

    const operationPlans = await Promise.all(operationPlanDocuments.map((doc) => OperationPlanMapper.toDomain(doc)));

    return operationPlans;
  }

  public async search(props: SearchOperationPlansQuery): Promise<OperationPlan[]> {
    const { from, to, vvnCode, sortBy = 'start', sortDir = 'asc' } = props;

    const query: Record<string, unknown> = {};

    if (typeof vvnCode === 'number') {
      query.vvnCode = vvnCode;
    }

    if (from && to) {
      query.$and = [{ start: { $lte: to } }, { end: { $gte: from } }];
    } else if (from && !to) {
      query.end = { $gte: from };
    } else if (!from && to) {
      query.start = { $lte: to };
    }

    const sortFieldMap: Record<OperationPlanSortBy, string> = {
      start: 'start',
      end: 'end',
      vvnCode: 'vvnCode',
      createdAt: 'createdAt',
    };

    const sortField = sortFieldMap[sortBy];
    const direction = sortDir === 'desc' ? -1 : 1;

    const operationPlanDocuments = await this.OperationPlanSchema.find(query).sort({ [sortField]: direction });

    const operationPlans = await Promise.all(operationPlanDocuments.map((doc) => OperationPlanMapper.toDomain(doc)));

    return operationPlans;
  }

  public async exists(operationPlan: OperationPlan): Promise<boolean> {
    const vvnCode = operationPlan.vvnCode.value;
    const query = { vvnCode: vvnCode };
    const operationPlanDocument = await this.OperationPlanSchema.findOne(query);

    return !!operationPlanDocument === true;
  }

  public async save(operationPlan: OperationPlan): Promise<OperationPlan> {
    const query = { vvnCode: operationPlan.vvnCode.value };

    const operationPlanDocument = await this.OperationPlanSchema.findOne(query);

    if (operationPlanDocument === null) {
      const rawOperationPlan = OperationPlanMapper.toPersistance(operationPlan);

      const createdOperationPlan = await this.OperationPlanSchema.create(rawOperationPlan);

      return OperationPlanMapper.toDomain(createdOperationPlan);
    }

    operationPlanDocument.dockCode = operationPlan.dockCode;
    operationPlanDocument.craneCodes = operationPlan.craneCodes;
    operationPlanDocument.storageAreaCode = operationPlan.storageAreaCode;
    operationPlanDocument.start = operationPlan.start;
    operationPlanDocument.end = operationPlan.end;
    operationPlanDocument.usedAlgorithm = operationPlan.usedAlgorithm;
    operationPlanDocument.creatorUserEmail = operationPlan.creatorUserEmail.value;
    operationPlanDocument.plannedOperations = operationPlan.plannedOperations;
    await operationPlanDocument.save();

    return operationPlan;
  }

  public async deleteByDate(date: Date): Promise<void> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    await this.OperationPlanSchema.deleteMany({
      start: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }
}
