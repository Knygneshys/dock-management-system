import { Inject, Service } from 'typedi';
import IIncidentRepo from '../../../domain/IRepos/IIncidentRepo';
import { Incident } from '../../../domain/entities/incident';
import { IncidentStatus } from '../../../domain/enums/incidentStatus';
import { GenericCode } from '../../../domain/object-values/genericCode';
import { Document, Model } from 'mongoose';
import { IIncidentPersistence } from '../../../use-cases/dataschema/IIncidentPersistence';
import { IncidentMap } from '../../../use-cases/mappers/IncidentMap';
import config from '../../../../config';
import IVisitIncidentRepo from '../../../domain/IRepos/IVisitIncidentRepo';
import { IIncidentTypeRepo } from '../../../domain/IRepos/IIncidentTypeRepo';
import { IncidentType } from '../../../domain/entities/incidentType';
import { VVE } from '../../../domain/entities/vve';
import IVVERepo from '../../../domain/IRepos/IVVERepo';

@Service()
export default class IncidentRepo implements IIncidentRepo {
  constructor(
    @Inject('incidentSchema') private incidentSchema: Model<IIncidentPersistence & Document>,
    @Inject(config.repos.visitIncident.name) private visitIncidentRepo: IVisitIncidentRepo,
    @Inject(config.repos.incidentType.name) private incidentTypeRepo: IIncidentTypeRepo,
    @Inject(config.repos.vve.name) private vveRepo: IVVERepo,
  ) {}

  private async joinDomainEntities(incidentRecord: IIncidentPersistence): Promise<{
    incidentType: IncidentType;
    affectedVVEs: VVE[];
  }> {
    const recordTypeCode: GenericCode = GenericCode.create(incidentRecord.typeCode).getValue()!;
    const incidentType = await this.incidentTypeRepo.findByCode(recordTypeCode);
    if (!incidentType) {
      throw new Error(
        `Database with inconsistence data! Incident Type with code ${incidentRecord.typeCode} not found! typeCode in incident ${incidentRecord.code}`,
      );
    }
    const recordCode: GenericCode = GenericCode.create(incidentRecord.code).getValue()!;

    const affectedVVECodes = (await this.visitIncidentRepo.search(undefined, recordCode)).map((vi) => vi.visitCode);
    const affectedVVEs: VVE[] = [];
    for (const code of affectedVVECodes) {
      const vve = await this.vveRepo.findByDomainId(code);
      if (!vve) {
        throw new Error(`Database with inconsistence data! VVE with code ${code} not found!`);
      }
      affectedVVEs.push(vve);
    }
    return { incidentType, affectedVVEs };
  }

  public async findByDomainId(incidentCode: GenericCode): Promise<Incident | null> {
    const query = { code: incidentCode.value };
    const incidentRecord = await this.incidentSchema.findOne(query);

    if (!incidentRecord) {
      return null;
    }

    const joinRecordEntities = await this.joinDomainEntities(incidentRecord);

    const incidentOrError = IncidentMap.persistenceToDomain(
      incidentRecord,
      joinRecordEntities.incidentType,
      joinRecordEntities.affectedVVEs,
    );

    if (incidentOrError.isFailure) {
      const errorValue = incidentOrError.errorValue();

      if (typeof errorValue === 'string') {
        throw new Error(errorValue);
      }

      throw new Error('Incident mapping error: ' + JSON.stringify(errorValue));
    }

    return incidentOrError.getValue()!;
  }

  public async search(from?: Date, until?: Date, status?: IncidentStatus, typeCodes?: string[]): Promise<Incident[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (status !== undefined) {
      query.status = status;
    }

    if (from || until) {
      query.startISO = {};
      if (from) {
        query.startISO.$gte = from;
      }
      if (until) {
        query.startISO.$lte = until;
      }
    }

    if (typeCodes !== undefined && typeCodes.length !== 0) {
      query.typeCode = { $in: typeCodes };
    }

    const incidentRecords = await this.incidentSchema.find(query);

    const incidents: Incident[] = [];

    for (const record of incidentRecords) {
      const joinRecordEntities = await this.joinDomainEntities(record);

      const incidentOrError = IncidentMap.persistenceToDomain(
        record,
        joinRecordEntities.incidentType,
        joinRecordEntities.affectedVVEs,
      );
      if (incidentOrError.isFailure) {
        const errorValue = incidentOrError.errorValue();
        throw new Error(
          typeof errorValue === 'string' ? errorValue : 'Incident mapping error: ' + JSON.stringify(errorValue),
        );
      }

      incidents.push(incidentOrError.getValue()!);
    }

    return incidents;
  }

  public async exists(incident: Incident): Promise<boolean> {
    const code: GenericCode = incident.code;
    const query = { code: code.value };
    const incidentDocument = await this.incidentSchema.findOne(query);

    return !!incidentDocument === true;
  }

  public async save(incident: Incident): Promise<Incident> {
    const query = { code: incident.code.value };

    const incidentDocument = await this.incidentSchema.findOne(query);

    if (incidentDocument === null) {
      const persistenceIncident = IncidentMap.toPersistence(incident);

      await this.incidentSchema.create(persistenceIncident);

      return incident;
    }
    incidentDocument.status = incident.status;
    incidentDocument.endISO = incident.end?.toISOString();
    await incidentDocument.save();

    return incident;
  }
}
