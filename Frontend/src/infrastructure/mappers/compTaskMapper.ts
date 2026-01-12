import { CreateCompTaskCommand } from "../../application/complementary-task/commands/CreateCompTaskCommand";
import { UpdateCompTaskCommand } from "../../application/complementary-task/commands/UpdateCompTaskCommand";


export function mapCreateCompTaskCommandToCreateCompTaskDto(command: CreateCompTaskCommand) {
    return {
        categoryCode: command.categoryCode,
        vveCode: command.vveCode,
        team: command.team,
        status: command.status,
        start: command.start,
        end: command.end,
        impactOnOperations: command.impactOnOperations,
    };
}

export function mapUpdateCompTaskCommandToUpdateCompTaskDto(command: UpdateCompTaskCommand) {
  const dto: any = {};
  
  if (command.team) dto.team = command.team;
  if (command.status) dto.status = command.status;
  if (command.end) dto.end = command.end;
  
  return dto;
}