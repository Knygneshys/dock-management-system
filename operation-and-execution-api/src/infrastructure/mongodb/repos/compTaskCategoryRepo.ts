import { Inject, Service } from 'typedi';
import ICompTaskCategoryRepo from '../../../domain/IRepos/ICompTaskCategoryRepo';
import { Model } from 'mongoose';
import { ICompTaskCategoryPersistence } from '../../../use-cases/dataschema/ICompTaskCategoryPersistence';
import { ComplementaryTaskCategory } from '../../../domain/entities/complementaryTaskCategory';
import { GenericCode } from '../../../domain/object-values/genericCode';
import { CompTaskCategoryMap } from '../../../use-cases/mappers/CompTaskCategoryMap';

@Service()
export default class CompTaskCategoryRepo implements ICompTaskCategoryRepo {
  constructor(@Inject('compTaskCategorySchema') private ctcSchema: Model<ICompTaskCategoryPersistence & Document>) {}

  public async findByDomainId(code: GenericCode): Promise<ComplementaryTaskCategory | null> {
    const query = { code: code.value };
    const ctcRecord = await this.ctcSchema.findOne(query);

    if (!ctcRecord) {
      return null;
    }

    const ctcResult = CompTaskCategoryMap.toDomain(ctcRecord);
    if (ctcResult.isFailure) {
      const errorValue = ctcResult.errorValue();

      if (typeof errorValue === 'string') {
        throw new Error(errorValue);
      }

      throw new Error('CompTaskCategory mapping error: ' + JSON.stringify(errorValue));
    }

    return ctcResult.getValue()!;
  }

  public async search(name?: string): Promise<ComplementaryTaskCategory[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (name !== undefined) {
      query.name = { $regex: name, $options: 'i' };
    }

    const ctcRecords = await this.ctcSchema.find(query);

    const ctcs: ComplementaryTaskCategory[] = [];

    for (const record of ctcRecords) {
      const ctcResult = CompTaskCategoryMap.toDomain(record);

      if (ctcResult.isFailure) {
        const errorValue = ctcResult.errorValue();
        throw new Error(
          typeof errorValue === 'string'
            ? errorValue
            : 'Complementary Task Category mapping error: ' + JSON.stringify(errorValue),
        );
      }

      ctcs.push(ctcResult.getValue()!);
    }

    return ctcs;
  }

  public async exists(ctc: ComplementaryTaskCategory): Promise<boolean> {
    const code = ctc.code.value;
    const query = { code: code };
    const ctcDocument = await this.ctcSchema.findOne(query);

    return !!ctcDocument === true;
  }

  public async save(ctc: ComplementaryTaskCategory): Promise<ComplementaryTaskCategory> {
    const code = ctc.code.value;
    const query = { code: code };

    const ctcDocument = await this.ctcSchema.findOne(query);

    if (ctcDocument === null) {
      const persistenceCtc = CompTaskCategoryMap.toPersistence(ctc);

      await this.ctcSchema.create(persistenceCtc);

      return ctc;
    }
    if (ctc.defaultDelay) {
      ctcDocument.defaultDelay = {
        hour: ctc.defaultDelay.hour,
        minute: ctc.defaultDelay.minute,
      };
    }
    ctcDocument.name = ctc.name;
    ctcDocument.description = ctc.description;

    await ctcDocument.save();

    return ctc;
  }
}
