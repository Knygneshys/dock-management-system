import { Inject, Service } from 'typedi';
import IVisitIncidentRepo from '../../../domain/IRepos/IVisitIncidentRepo';
import { Model } from 'mongoose';
import { IVisitIncidentPersistence } from '../../../use-cases/dataschema/IVisitIncidentPersistence';
import { VisitIncident } from '../../../domain/entities/visitIncident';
import { GenericCode } from '../../../domain/object-values/genericCode';
import { VVNCode } from '../../../domain/object-values/vvnCode';
import { VisitIncidentMap } from '../../../use-cases/mappers/VisitIncidentMap';

@Service()
export default class VisitIncidentRepo implements IVisitIncidentRepo {
  constructor(
    @Inject('visitIncidentSchema') private visitincidentSchema: Model<IVisitIncidentPersistence & Document>,
  ) {}

  public async findByDomainId(visitIncidentCode: GenericCode): Promise<VisitIncident | null> {
    const query = { code: visitIncidentCode.value };
    const visitIncidentRecord = await this.visitincidentSchema.findOne(query);

    if (!visitIncidentRecord) {
      return null;
    }

    const visitIncidentOrError = await VisitIncidentMap.toDomain({
      code: visitIncidentRecord.code,
      incidentCode: visitIncidentRecord.incidentCode,
      vveCode: visitIncidentRecord.vveCode,
    });

    if (visitIncidentOrError.isFailure) {
      const errorValue = visitIncidentOrError.errorValue();

      if (typeof errorValue === 'string') {
        throw new Error(errorValue);
      }

      throw new Error('Visit Incident mapping error: ' + JSON.stringify(errorValue));
    }

    return visitIncidentOrError.getValue()!;
  }

  public async search(vveCode?: VVNCode, incidentCode?: GenericCode): Promise<VisitIncident[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (vveCode !== undefined) {
      query.vveCode = vveCode.value;
    }

    if (incidentCode !== undefined) {
      query.incidentCode = incidentCode.value;
    }

    const visitIncidentRecords = await this.visitincidentSchema.find(query);

    const visitIncidents: VisitIncident[] = [];

    for (const record of visitIncidentRecords) {
      const visitIncidentOrError = await VisitIncidentMap.toDomain({
        code: record.code,
        incidentCode: record.incidentCode,
        vveCode: record.vveCode,
      });

      if (visitIncidentOrError.isFailure) {
        const errorValue = visitIncidentOrError.errorValue();

        if (typeof errorValue === 'string') {
          throw new Error(errorValue);
        }

        throw new Error('Visit Incident mapping error: ' + JSON.stringify(errorValue));
      }

      visitIncidents.push(visitIncidentOrError.getValue()!);
    }

    return visitIncidents;
  }

  public async exists(visitIncident: VisitIncident): Promise<boolean> {
    const code: GenericCode = visitIncident.code;
    const query = { code: code.value };
    const visitIncidentDocument = await this.visitincidentSchema.findOne(query);

    return !!visitIncidentDocument === true;
  }

  public async save(visitIncident: VisitIncident): Promise<VisitIncident> {
    const query = { code: visitIncident.code.value };

    const visitIncidentDocument = await this.visitincidentSchema.findOne(query);
    if (visitIncidentDocument === null) {
      const persistenceVisitIncident = VisitIncidentMap.toPersistence(visitIncident);

      await this.visitincidentSchema.create(persistenceVisitIncident);

      return visitIncident;
    }

    throw new Error('Visit Incident already exists!');
  }

  public async deleteByDomainCode(visitIncidentCode: GenericCode): Promise<void> {
    const query = { code: visitIncidentCode.value };
    await this.visitincidentSchema.deleteOne(query);
  }
}
