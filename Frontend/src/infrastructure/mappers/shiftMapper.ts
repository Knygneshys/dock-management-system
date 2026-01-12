import type { CreateShiftCommand } from "../../application/shifts/commands/CreateShiftCommand";

export function mapCreateShiftCommandToCreateShiftDto (command: CreateShiftCommand) {
    return{
        day: command.day,
        month: command.month,
        year: command.year,
        fromHour: command.fromHour,
        fromMinute: command.fromMinute,
        toHour: command.toHour,
        toMinute: command.toMinute,
        resourceCode: command.resourceCode,
    }
}