import type { IStaffRepository } from "../../../domain/interfaces/IStaffRepository";
import type { CreateStaffCommand } from "../commands/CreateStaffCommand";

export function CreateStaff(staffRepository : IStaffRepository) {
    return async (staff : CreateStaffCommand) => await staffRepository.create(staff);
}