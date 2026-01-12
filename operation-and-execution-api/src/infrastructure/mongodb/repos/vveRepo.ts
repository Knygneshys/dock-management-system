import { Inject, Service } from 'typedi';
import IVVERepo from '../../../domain/IRepos/IVVERepo';
import { Model } from 'mongoose';
import { IVVEPersistence } from '../../../use-cases/dataschema/IVVEPersistence';
import { VVE } from '../../../domain/entities/vve';
import { VVNCode } from '../../../domain/object-values/vvnCode';
import { VVEMap } from '../../../use-cases/mappers/VVEMap';
import { VVEStatus } from '../../../domain/enums/vveStatus';
import { VesselImo } from '../../../domain/object-values/vesselImo';
import { ExecutedOperationMapper } from '../../../use-cases/mappers/ExecutedOperationMapper';

@Service()
export default class VVERepo implements IVVERepo {
  constructor(@Inject('vveSchema') private vveSchema: Model<IVVEPersistence & Document>) {}

  public async findByDomainId(vveCode: VVNCode): Promise<VVE | null> {
    const query = { code: vveCode.value };
    const vveRecord = await this.vveSchema.findOne(query);

    if (!vveRecord) {
      return null;
    }

    const vveOrError = VVEMap.toDomain({
      code: vveRecord.code,
      vvnCode: vveRecord.vvnCode,
      vesselImo: vveRecord.vesselImo,
      arrivalTime: vveRecord.arrivalTime,
      creatorUserEmail: vveRecord.creatorUserEmail,
      status: vveRecord.status,
      dockCode: vveRecord.dockCode,
      executedOperations: vveRecord.executedOperations,
      ...(vveRecord.notes !== undefined ? { notes: vveRecord.notes } : {}),
      ...(vveRecord.updatedAt !== undefined ? { updatedAt: vveRecord.updatedAt } : {}),
    });

    if (vveOrError.isFailure) {
      const errorValue = vveOrError.errorValue();

      if (typeof errorValue === 'string') {
        throw new Error(errorValue);
      }

      throw new Error('VVE mapping error: ' + JSON.stringify(errorValue));
    }

    return vveOrError.getValue()!;
  }

  public async exists(vve: VVE): Promise<boolean> {
    const code: VVNCode = vve.code;
    const query = { code: code.value };
    const vveDocument = await this.vveSchema.findOne(query);

    return !!vveDocument === true;
  }

  public async save(vve: VVE): Promise<VVE> {
    const query = { code: vve.code.value };
    const vveDocument = await this.vveSchema.findOne(query);

    if (vveDocument === null) {
      const persistenceVve = VVEMap.toPersistence(vve);
      await this.vveSchema.create(persistenceVve);
      return vve;
    }
    console.log(vve.executedOperations);
    const executedOperations = vve.executedOperations.map((op) => ExecutedOperationMapper.toPersistence(op));

    console.log(executedOperations);
    vveDocument.status = vve.status;
    vveDocument.dockCode = vve.dockCode.value;
    vveDocument.executedOperations = executedOperations;

    await vveDocument.save();
    return vve;
  }

  public async getAll(): Promise<VVE[]> {
    try {
      const vveRecords = await this.vveSchema.find({});

      const vves: VVE[] = [];

      for (const record of vveRecords) {
        const vveResult = VVEMap.toDomain({
          code: record.code,
          vvnCode: record.vvnCode,
          vesselImo: record.vesselImo,
          arrivalTime: record.arrivalTime,
          creatorUserEmail: record.creatorUserEmail,
          status: record.status,
          dockCode: record.dockCode,
          executedOperations: record.executedOperations,
          ...(record.notes !== undefined ? { notes: record.notes } : {}),
          ...(record.updatedAt !== undefined ? { updatedAt: record.updatedAt } : {}),
        });

        if (vveResult.isSuccess) {
          vves.push(vveResult.getValue()!);
        } else {
          console.warn(`Failed to map VVE ${record.code}:`, vveResult.errorValue());
        }
      }

      return vves;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw new Error('Failed to retrieve VVEs');
    }
  }

  public async search(start?: Date, vesselImo?: VesselImo, status?: VVEStatus): Promise<VVE[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (start) {
      query.arrivalTime = { $gte: start };
    }

    if (vesselImo) {
      query.vesselImo = vesselImo.value;
    }

    if (status) {
      query.status = status;
    }

    const vveRecords = await this.vveSchema.find(query);

    if (!vveRecords || vveRecords.length === 0) {
      return [];
    }

    const vves: VVE[] = [];

    for (const vve of vveRecords) {
      const vveResult = VVEMap.toDomain(vve);

      if (vveResult.isFailure) {
        const errorValue = vveResult.errorValue();
        if (typeof errorValue === 'string') {
          throw new Error(errorValue);
        }
        throw new Error('Vve mapping error: ' + JSON.stringify(errorValue));
      }

      vves.push(vveResult.getValue()!);
    }

    return vves;
  }
}
