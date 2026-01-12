import type { CreateStaffCommand } from "../../application/staff/commands/CreateStaffCommand";
import type { UpdateStaffCommand } from "../../application/staff/commands/UpdateStaffCommand";

export function mapCreateStaffCommandToCreateStaffDto (command: CreateStaffCommand) {
    return{
        mecanographicNumber: command.mecanographicNumber,
        name: command.name,
        email: command.email,
        phone: command.phone,
        status: command.status,
        qualificationCodes: command.qualificationCodes,
        isActive: command.isActive,
    } 
};

export function mapUpdateStaffCommandToUpdateStaffDto (command: UpdateStaffCommand) {
    return{
        name: command.name,
        email: command.email,
        phone: command.phone,
        status: command.status,
        qualificationCodes: command.qualificationCodes,
    }
}