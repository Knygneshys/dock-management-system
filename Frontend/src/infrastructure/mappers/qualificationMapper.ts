import type { CreateQualificationCommand } from "../../application/qualification/commands/CreateQualificationCommand";
import type { UpdateQualificationCommand } from "../../application/qualification/commands/UpdateQualificationCommand";
import type { QualificationUpdateDto } from "../dtos/qualification/qualificaitonUpdateDto";
import type { QualificationCreateDto } from "../dtos/qualification/qualificationCreateDto";

export function mapCreateQualificationCommandToQualificationCreateDto (command: CreateQualificationCommand) : QualificationCreateDto {
    return{
        code: command.code,
        name: command.name,
    }
}

export function mapUpdateQualificationCommandToUpdateQualificationDto (command: UpdateQualificationCommand) : QualificationUpdateDto {
    return{
        code: command.code,
        name: command.name,
    }
}