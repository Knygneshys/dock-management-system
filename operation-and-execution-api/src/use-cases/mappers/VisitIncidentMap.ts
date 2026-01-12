import { VisitIncident } from '../../domain/entities/visitIncident';
import { GenericCode } from '../../domain/object-values/genericCode';
import { VVNCode } from '../../domain/object-values/vvnCode';
import { Mapper } from '../../shared/infra/Mapper';
import { Result } from '../../shared/logic/Result';
import { UniqueEntityID } from '../../shared/domain/UniqueEntityID';
import { IVisitIncidentPersistence } from '../dataschema/IVisitIncidentPersistence';

export class VisitIncidentMap extends Mapper<VisitIncident> {
  public static async toDomain(record: IVisitIncidentPersistence): Promise<Result<VisitIncident>> {
    const codeResult = GenericCode.create(record.code);
    const incidentCodeResult = GenericCode.create(record.incidentCode);
    const vveCodeResult = VVNCode.create(record.vveCode);
    const combinedResult = Result.combine([codeResult, incidentCodeResult, vveCodeResult]);

    if (combinedResult.isFailure) {
      return Result.fail<VisitIncident>(combinedResult.errorValue());
    }

    const visitIncidentOrError = VisitIncident.create(
      {
        code: codeResult.getValue()!,
        incidentCode: incidentCodeResult.getValue()!,
        visitCode: vveCodeResult.getValue()!,
      },
      new UniqueEntityID(record.code.toString()),
    );

    return visitIncidentOrError;
  }

  public static toPersistence(visitIncident: VisitIncident): IVisitIncidentPersistence {
    return {
      code: visitIncident.code.value,
      vveCode: visitIncident.visitCode.value,
      incidentCode: visitIncident.incidentCode.value,
    };
  }
}
