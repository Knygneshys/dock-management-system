import { ExternalApiStaffRepository } from "../../infrastructure/repositories/ExternalApiStaffRepository";
import { ActivateStaff } from "./use-cases/ActivateStaff";
import { CreateStaff } from "./use-cases/CreateStaff";
import { DeactivateStaff } from "./use-cases/DeactivateStaff";
import { GetAllStaffs } from "./use-cases/GetAllStaffs";
import { UpdateStaff } from "./use-cases/UpdateStaff";

export const GetAllStaffUseCase = GetAllStaffs(ExternalApiStaffRepository);

export const CreateStaffUseCase = CreateStaff(ExternalApiStaffRepository);

export const UpdateStaffUseCase = UpdateStaff(ExternalApiStaffRepository);

export const DeactivateStaffUseCase = DeactivateStaff(ExternalApiStaffRepository);

export const ActivateStaffUseCase = ActivateStaff(ExternalApiStaffRepository);
