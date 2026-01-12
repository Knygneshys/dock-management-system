import { Inject, Service } from 'typedi';
import { IIncidentTypeRepo } from '../../../domain/IRepos/IIncidentTypeRepo';
import { incidentTypeSchemaDependencyInjection } from '../../../shared/domain/constants/dependency-injection-strings';
import { Model } from 'mongoose';
import { IIncidentTypePersistence } from '../../../use-cases/dataschema/IIncidentTypePersistence';
import { IncidentType } from '../../../domain/entities/incidentType';
import { IncidentTypeMapper } from '../../../use-cases/mappers/IncidentTypeMapper';
import { SearchIncidentTypeQuery } from '../../../use-cases/queries/incident-type/SearchIncidentTypeQuery';
import { GenericCode } from '../../../domain/object-values/genericCode';

@Service()
export default class IncidentTypeRepo implements IIncidentTypeRepo {
  constructor(
    @Inject(incidentTypeSchemaDependencyInjection)
    private IncidentTypeSchema: Model<IIncidentTypePersistence & Document>,
  ) {}

  public async search(query: SearchIncidentTypeQuery): Promise<IncidentType[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbQuery: any = {};

    if (query.code) {
      dbQuery.code = { $regex: query.code, $options: 'i' };
    }
    if (query.parentIncidentTypeCode) {
      dbQuery.parentIncidentTypeCode = { $regex: query.parentIncidentTypeCode, $options: 'i' };
    }
    if (query.description) {
      dbQuery.description = { $regex: query.description, $options: 'i' };
    }
    if (query.severity) {
      dbQuery.severity = query.severity;
    }

    const incidentTypeRecords = await this.IncidentTypeSchema.find(dbQuery);

    if (incidentTypeRecords.length === 0) {
      return [];
    }

    const incidentTypes = await Promise.all(incidentTypeRecords.map((record) => IncidentTypeMapper.toDomain(record)));

    return incidentTypes;
  }

  public async getAll(): Promise<IncidentType[]> {
    const incidentTypeDocuments = await this.IncidentTypeSchema.find();

    const incidentTypes = await Promise.all(incidentTypeDocuments.map((doc) => IncidentTypeMapper.toDomain(doc)));

    return incidentTypes;
  }

  public async findByCode(code: GenericCode): Promise<IncidentType | null> {
    const query = { code: code.value };
    const incidentTypeDocument = await this.IncidentTypeSchema.findOne(query);

    if (incidentTypeDocument === null) {
      return null;
    }

    return IncidentTypeMapper.toDomain(incidentTypeDocument);
  }

  public async save(incidentType: IncidentType): Promise<IncidentType> {
    const query = { code: incidentType.code.value };

    const incidentTypeDocument = await this.IncidentTypeSchema.findOne(query);

    if (incidentTypeDocument === null) {
      const rawIncidentType = IncidentTypeMapper.toPersistence(incidentType);

      const createdIncidentType = await this.IncidentTypeSchema.create(rawIncidentType);

      return IncidentTypeMapper.toDomain(createdIncidentType);
    }

    incidentTypeDocument.name = incidentType.name;
    incidentTypeDocument.description = incidentType.description;
    incidentTypeDocument.severity = incidentType.severity;
    incidentTypeDocument.parentIncidentTypeCode = incidentType.parentIncidentTypeCode;
    await incidentTypeDocument.save();

    return incidentType;
  }
}
