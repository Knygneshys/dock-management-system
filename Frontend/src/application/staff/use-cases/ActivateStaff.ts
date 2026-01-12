import type { IStaffRepository } from "../../../domain/interfaces/IStaffRepository";

export function ActivateStaff(staffRepository : IStaffRepository) {
    return async (mNumber : number) => await staffRepository.activate(mNumber);
}