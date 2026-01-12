import { compTaskStatus } from "../../domain/enums/compTaskStatus";
import { GenericCode } from "../../domain/object-values/genericCode";
import { VVNCode } from "../../domain/object-values/vvnCode";
import { Result } from "../../shared/logic/Result";
import { ICompTaskDTO } from "../dto/ICompTaskDTO";
import { ICompTaskUpdateDTO } from "../dto/ICompTaskUpdateDTO";

export default interface ICompTaskService {
    create(dto: ICompTaskDTO): Promise<Result<ICompTaskDTO>>;

    getAll(): Promise<Result<ICompTaskDTO[]>>;

    update(dto: ICompTaskUpdateDTO, code: GenericCode): Promise<Result<void>>;

    getAllByVve(vveCode: VVNCode): Promise<Result<ICompTaskDTO[]>>;

    search(start?: Date, end?: Date, status?: compTaskStatus): Promise<Result<ICompTaskDTO[]>>;

    getByCode(code: GenericCode): Promise<Result<ICompTaskDTO>>;
}