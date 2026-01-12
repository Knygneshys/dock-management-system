import type { IStaffRepository } from "../../../domain/interfaces/IStaffRepository";

export function GetAllStaffs(staffRepository : IStaffRepository) {
    return async () => await staffRepository.getAll();
}