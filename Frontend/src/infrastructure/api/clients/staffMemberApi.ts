import type { StaffMember } from "../../../domain/Types/entities/StaffMember";
import type { operationalWindowFormDto } from "../../dtos/operational-window/OperationalWindowFormDto";
import type { staffCreateDto } from "../../dtos/staff-member/staffCreateDto";
import type { staffUpdateDto } from "../../dtos/staff-member/staffUpdateDto";
import { staffMemberUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllStaffMembers = async (): Promise<StaffMember[]> => {
  try {
    const response = await apiClient.get<StaffMember[]>(
      staffMemberUris.GET_ALL
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createStaffMember = async (
  staffMember: staffCreateDto
): Promise<number> => {
  try {
    const { data } = await apiClient.post<number>(
      staffMemberUris.CREATE,
      staffMember
    );
    const staffMemberId = data;
    return staffMemberId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deactivateStaffMember = async (
  mNumber: number
): Promise<StaffMember> => {
  try {
    const { data } = await apiClient.put<StaffMember>(
      staffMemberUris.DEACTIVATE(mNumber)
    );
    const staff = data;

    return staff;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activateStaffMember = async (
  mNumber: number
): Promise<StaffMember> => {
  try {
    const { data } = await apiClient.put<StaffMember>(
      staffMemberUris.ACTIVATE(mNumber)
    );
    const staff = data;

    return staff;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateStaffMember = async (
  mNumber: number,
  staffMember: staffUpdateDto
): Promise<StaffMember> => {
  try {
    const uri = `${staffMemberUris.UPDATE}/${mNumber}`;
    const { data } = await apiClient.put<StaffMember>(uri, staffMember);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createOperationalWindow = async (
  mNumber: number,
  operationalWindow: operationalWindowFormDto
): Promise<void> => {
  try {
    await apiClient.post(
      staffMemberUris.ADD_OPERATIONAL_WINDOW(mNumber),
      operationalWindow
    );
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const deleteOperationalWindow = async (
  mecanographicNumber: number,
  operationalWindowCode: string
): Promise<void> => {
  try {
    await apiClient.delete(
      staffMemberUris.DELETE_OPERATIONAL_WINDOW(
        mecanographicNumber,
        operationalWindowCode
      )
    );
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const updateOperationalWindow = async (
  mecanographicNumber: number,
  operationalWindowCode: string,
  operationalWindow: operationalWindowFormDto
): Promise<void> => {
  try {
    await apiClient.put(
      staffMemberUris.UPDATE_OPERATIONAL_WINDOW(
        mecanographicNumber,
        operationalWindowCode
      ),
      operationalWindow
    );
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};
