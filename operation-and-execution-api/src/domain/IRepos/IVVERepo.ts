import { VVE } from '../entities/vve';
import { VVNCode } from '../object-values/vvnCode';
import { Repo } from '../../shared/infra/Repo';
import { VesselImo } from '../object-values/vesselImo';
import { VVEStatus } from '../enums/vveStatus';

export default interface IVVERepo extends Repo<VVE> {
  findByDomainId(vveCode: VVNCode): Promise<VVE | null>;
  getAll(): Promise<VVE[]>;
  search(start?: Date, vesselImo?: VesselImo, status?: VVEStatus): Promise<VVE[]>;
}
