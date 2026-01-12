import type { IStaffRepository } from "../../../domain/interfaces/IStaffRepository";
import type { UpdateStaffCommand } from "../commands/UpdateStaffCommand";

export function UpdateStaff(staffRepository : IStaffRepository) {
    return async (mNumber : number, command : UpdateStaffCommand) => await staffRepository.update(mNumber, command);
}