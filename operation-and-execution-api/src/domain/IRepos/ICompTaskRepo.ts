import { Repo } from "../../shared/infra/Repo";
import { ComplementaryTask } from "../entities/ComplementaryTask";
import { compTaskStatus } from "../enums/compTaskStatus";
import { GenericCode } from "../object-values/genericCode";
import { VVNCode } from "../object-values/vvnCode";

export default interface ICompTaskRepo extends Repo<ComplementaryTask> {
    findByDomainCode(code: GenericCode): Promise<ComplementaryTask | null>;
    getAllCompTasksByVve(vveCode: VVNCode): Promise<ComplementaryTask[]>;
    getAllCompTasks(): Promise<ComplementaryTask[]>;
    search(start?: Date, end?: Date, status?: compTaskStatus): Promise<ComplementaryTask[] | null>;
}
