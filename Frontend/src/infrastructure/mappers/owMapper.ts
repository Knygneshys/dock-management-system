import type { OWCommand } from "../../application/operational-window/commands/OWCommand";

export function mapOWCommandToOWFormDto(command: OWCommand) {
    return{
        code: command.code,
        dayOfWeek: command.dayOfWeek,
        startHour: command.startHour,
        startMinute: command.startMinute,
        endHour: command.endHour,
        endMinute: command.endMinute,
    }
}