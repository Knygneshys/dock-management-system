import { ExecutedOperation } from '../../domain/entities/ExecutedOperation';
import { VVEStatus } from '../../domain/enums/vveStatus';
import { VesselImo } from '../../domain/object-values/vesselImo';
import { Result } from '../../shared/logic/Result';
import { CreateExecutedOperationCommand } from '../commands/executed-operation/CreateExecutedOperationCommand';
import { IUpdateVVEDTO } from '../dto/vve-dtos/IUpdateVVEDTO';
import { IVVEDTO } from '../dto/vve-dtos/IVVEDTO';

export default interface IVVEService {
  createVve(vveDTO: IVVEDTO): Promise<Result<IVVEDTO>>;
  getAllVves(): Promise<Result<IVVEDTO[]>>;
  search(start?: Date, end?: Date, vesselImo?: VesselImo, status?: VVEStatus): Promise<Result<IVVEDTO[]>>;
  updateVVE(dto: IUpdateVVEDTO): Promise<Result<IVVEDTO>>;
  addExecutedOperation(code: number, command: CreateExecutedOperationCommand): Promise<Result<IVVEDTO>>;
  getExecutedOperations(code: number): Promise<Result<ExecutedOperation[]>>;
}
