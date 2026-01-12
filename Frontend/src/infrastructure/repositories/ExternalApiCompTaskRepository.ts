import { CreateCompTaskCommand } from "../../application/complementary-task/commands/CreateCompTaskCommand";
import { UpdateCompTaskCommand } from "../../application/complementary-task/commands/UpdateCompTaskCommand";
import { CompTaskSearchQuery } from "../../application/complementary-task/queries/CompTaskSearchQuery";
import { ICompTaskRepo } from "../../domain/interfaces/ICompTaskRepo";
import { CompTask } from "../../domain/Types/entities/CompTask";
import { createCompTask, getAllCompTasks, getCompTaskByCode, searchCompTasks, updateCompTask } from "../api/clients/compTasksApi";
import { mapCreateCompTaskCommandToCreateCompTaskDto, mapUpdateCompTaskCommandToUpdateCompTaskDto } from "../mappers/compTaskMapper";

export const ExternalApiCompTaskRepository: ICompTaskRepo = {
    create: async function (command: CreateCompTaskCommand): Promise<CompTask>{
        const dto = mapCreateCompTaskCommandToCreateCompTaskDto(command);

        return await createCompTask(dto);
    },

    getAll: async function (): Promise<CompTask[]>{
        return await getAllCompTasks();
    },

    update: async function (command: UpdateCompTaskCommand, code: string): Promise<void>{
        const dto = mapUpdateCompTaskCommandToUpdateCompTaskDto(command);

        return await updateCompTask(code, dto);
    },

    search: async function (query: CompTaskSearchQuery): Promise<CompTask[]>{
        return await searchCompTasks(query);
    },

    getAllTasksByVVE: async function (code: number): Promise<CompTask[]>{
        return await this.getAllTasksByVVE(code);
    },

    async getByCode(code: string) {
    return await getCompTaskByCode(code);
  },
}
