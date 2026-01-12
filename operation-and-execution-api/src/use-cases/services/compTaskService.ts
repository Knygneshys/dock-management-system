import { Inject, Service } from "typedi";
import config from '../../../config';
import ICompTaskRepo from "../../domain/IRepos/ICompTaskRepo";
import { ICompTaskDTO } from "../dto/ICompTaskDTO";
import { Result } from "../../shared/logic/Result";
import { GenericCode } from "../../domain/object-values/genericCode";
import { CompTaskMap } from "../mappers/CompTaskMap";
import { ComplementaryTask } from "../../domain/entities/ComplementaryTask";
import ICompTaskService from "../IServices/ICompTaskService";
import { ICompTaskUpdateDTO } from "../dto/ICompTaskUpdateDTO";
import { VVNCode } from "../../domain/object-values/vvnCode";
import { compTaskStatus } from "../../domain/enums/compTaskStatus";


@Service()
export default class compTaskService implements ICompTaskService{
constructor(@Inject(config.repos.compTask.name) private ctRepo: ICompTaskRepo) {}
    
  public async create(dto: ICompTaskDTO): Promise<Result<ICompTaskDTO>>{
    let code: GenericCode;
    do {
      const rawCode = 'CT-' + Math.floor(Math.random() * 101);
      code = GenericCode.create(rawCode).getValue()!;
    } while (await this.ctRepo.findByDomainCode(code));

    dto.code = code.value;

    const propsResult = CompTaskMap.toDomainProps(dto);

    if (propsResult.isFailure) {
        return Result.fail<ICompTaskDTO>(propsResult.errorValue());
    }

    const ctResult = ComplementaryTask.create(propsResult.getValue()!);
    if (ctResult.isFailure) {
        return Result.fail<ICompTaskDTO>(ctResult.errorValue());
    }

    await this.ctRepo.save(ctResult.getValue()!);

    const ctRetDto = CompTaskMap.toDTO(ctResult.getValue()!);

    return Result.ok<ICompTaskDTO>(ctRetDto);
  }

  public async getAll(): Promise<Result<ICompTaskDTO[]>> {
    const tasks = await this.ctRepo.getAllCompTasks();
    
    if (!tasks) {
        return Result.ok([]);
    }
    
    const tasksDto: ICompTaskDTO[] = [];
    for (let i = 0; i < tasks.length; i++) {
        tasksDto[i] = CompTaskMap.toDTO(tasks[i]!);
    }
    return Result.ok(tasksDto);
}

public async update(
  dto: ICompTaskUpdateDTO,
  code: GenericCode
): Promise<Result<void>> {

  const task = await this.ctRepo.findByDomainCode(code);
  if (!task) {
    return Result.fail('Complementary task not found!');
  }

  const updatePropsResult = CompTaskMap.toUpdateProps(dto);
  if (updatePropsResult.isFailure) {
    return Result.fail(updatePropsResult.errorValue());
  }

  const updateProps = updatePropsResult.getValue()!;

  const updatedResult = task.update(updateProps);

  if(updatedResult.isFailure){
    return Result.fail(updatedResult.errorValue());
  }

  await this.ctRepo.save(task);
  return Result.ok();
}

public async getAllByVve(vveCode: VVNCode): Promise<Result<ICompTaskDTO[]>> {
    const vveTasks = await this.ctRepo.getAllCompTasksByVve(vveCode);

    if(!vveTasks){
        return Result.fail('There is no complementary task attached to that VVE!');
    }

    const taskDto: ICompTaskDTO[] = [];
    for(let i = 0; i<vveTasks.length; i++){
        taskDto[i] = CompTaskMap.toDTO(vveTasks[i]!);
    }

    return Result.ok(taskDto);
}

public async search(
  start?: Date,
  end?: Date,
  status?: compTaskStatus
): Promise<Result<ICompTaskDTO[]>> {

  const tasks = await this.ctRepo.search(start, end, status);

  if (!tasks || tasks.length === 0) {
    return Result.ok([]);
  }

  const dtoList = tasks.map(task =>
    CompTaskMap.toDTO(task)
  );

  return Result.ok(dtoList);
}


public async getByCode(code: GenericCode): Promise<Result<ICompTaskDTO>> {
  const task = await this.ctRepo.findByDomainCode(code);
  
  if (!task) {
    return Result.fail('Complementary task not found!');
  }
  
  const taskDto = CompTaskMap.toDTO(task);
  return Result.ok(taskDto);
}
}
