import type { IStaffRepository } from "../../../domain/interfaces/IStaffRepository";

export function DeactivateStaff(staffRepository : IStaffRepository) {
    return async (mNumber : number) => await staffRepository.deactivate(mNumber);
}