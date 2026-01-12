import { ExternalApiCompTaskRepository } from "../../infrastructure/repositories/ExternalApiCompTaskRepository";
import { CreateCompTask } from "./use-cases/CreateCompTask";
import { GetAllCompTasks } from "./use-cases/GetAllCompTasks";
import { GetAllTasksByVVE } from "./use-cases/GetAllTasksByVVE";
import { GetCompTaskByCode } from "./use-cases/GetCompTaskByCode";
import { SearchCompTasks } from "./use-cases/SearchCompTasks";
import { UpdateCompTask } from "./use-cases/UpdateCompTasks";

export const GetAllCompTasksUseCase = GetAllCompTasks(ExternalApiCompTaskRepository);

export const CreateCompTaskUseCase = CreateCompTask(ExternalApiCompTaskRepository);

export const UpdateCompTaskUseCase = UpdateCompTask(ExternalApiCompTaskRepository);

export const GetCompTasksByVVEUseCase = GetAllTasksByVVE(ExternalApiCompTaskRepository);

export const SearchCompTasksUseCase = SearchCompTasks(ExternalApiCompTaskRepository);

export const GetCompTaskByCodeUseCase = GetCompTaskByCode(ExternalApiCompTaskRepository);