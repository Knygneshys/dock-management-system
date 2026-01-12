import type { Shift } from "../../../domain/Types/entities/Shift";
import type { ShiftCreateDto } from "../../dtos/shift/shiftCreateDto";
import { shiftUris } from "../api-utils/apiUriUtils";
import { apiClient } from "../apiClient";

export const getAllShifts = async () => {
  try {
    const data = await apiClient.get(shiftUris.getAll);
    return data.data as Shift[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createShift = async (
  mNumber: number,
  shift: ShiftCreateDto
): Promise<Shift> => {
  try {
    const data = await apiClient.post(shiftUris.create(mNumber), shift);
    const shiftId = data.data as Shift;
    return shiftId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
