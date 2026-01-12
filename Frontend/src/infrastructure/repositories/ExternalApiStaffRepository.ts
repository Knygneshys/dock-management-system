import {
  activateStaffMember,
  createStaffMember,
  deactivateStaffMember,
  getAllStaffMembers,
  updateStaffMember,
} from "../api/clients/staffMemberApi";
import type { IStaffRepository } from "../../domain/interfaces/IStaffRepository";
import type { StaffMember } from "../../domain/Types/entities/StaffMember";
import type { CreateStaffCommand } from "../../application/staff/commands/CreateStaffCommand";
import {
  mapCreateStaffCommandToCreateStaffDto,
  mapUpdateStaffCommandToUpdateStaffDto,
} from "../mappers/staffMapper";
import type { UpdateStaffCommand } from "../../application/staff/commands/UpdateStaffCommand";

export const ExternalApiStaffRepository: IStaffRepository = {
  getAll: async function (): Promise<StaffMember[]> {
    return await getAllStaffMembers();
  },

  create: async function (command: CreateStaffCommand): Promise<number | null> {
    const dto = mapCreateStaffCommandToCreateStaffDto(command);

    return await createStaffMember(dto);
  },

  update: async function (
    mecanographicNumber: number,
    command: UpdateStaffCommand
  ): Promise<StaffMember | null> {
    const dto = mapUpdateStaffCommandToUpdateStaffDto(command);

    return await updateStaffMember(mecanographicNumber, dto);
  },

  deactivate: async function (
    mecanographicNumber: number
  ): Promise<StaffMember | null> {
    return await deactivateStaffMember(mecanographicNumber);
  },

  activate: async function (
    mecanographicNumber: number
  ): Promise<StaffMember | null> {
    return await activateStaffMember(mecanographicNumber);
  },
};
