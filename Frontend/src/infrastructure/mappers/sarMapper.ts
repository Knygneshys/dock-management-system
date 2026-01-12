import type { CreateSARCommand } from "../../application/shipping-agent-rep/commands/CreateSARCommand";

export function mapCreateSarCommmandToSarDto(command: CreateSARCommand) {
  return {
    name: command.name,
    email: command.email,
    companyCode: command.companyCode
  };
}
