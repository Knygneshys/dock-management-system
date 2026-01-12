import { Repo } from '../../shared/infra/Repo';
import { VisitIncident } from '../entities/visitIncident';
import { GenericCode } from '../object-values/genericCode';
import { VVNCode } from '../object-values/vvnCode';

export default interface IVisitIncidentRepo extends Repo<VisitIncident> {
  findByDomainId(visitIncidentCode: GenericCode): Promise<VisitIncident | null>;
  search(vveCode?: VVNCode, incidentCode?: GenericCode): Promise<VisitIncident[]>;
  deleteByDomainCode(visitIncidentCode: GenericCode): Promise<void>;
}
