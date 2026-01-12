import { CreateCompTaskCommand } from "../../application/complementary-task/commands/CreateCompTaskCommand";
import { UpdateCompTaskCommand } from "../../application/complementary-task/commands/UpdateCompTaskCommand";
import { CompTaskSearchQuery } from "../../application/complementary-task/queries/CompTaskSearchQuery";
import { CompTask } from "../Types/entities/CompTask";

export interface ICompTaskRepo {
  create(command: CreateCompTaskCommand): Promise<CompTask>;
  getAll(): Promise<CompTask[]>;
  update(command: UpdateCompTaskCommand, code: string): Promise<void>;
  search(query: CompTaskSearchQuery): Promise<CompTask[]>;
  getAllTasksByVVE(vveCode: number): Promise<CompTask[]>;
  getByCode(code: string): Promise<CompTask>;
}