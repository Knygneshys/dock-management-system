import { useMutation } from "@tanstack/react-query";

import type { ShiftCreateDto } from "../../../../infrastructure/dtos/shift/shiftCreateDto";
import { getAllShiftsQueryKey } from "../../query-keys/shiftQueryKey";
import { CreateShiftUseCase } from "../../../../application/shifts/ShiftDependencyInjection";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";

interface Props {
  mNumber: number;
  shift: ShiftCreateDto;
}

export const useCreateShiftMutation = () => {
  return useMutation({
    mutationFn: ({ mNumber, shift }: Props) => {
      return CreateShiftUseCase(mNumber, shift);
    },
    meta: {
      invalidatesQuery: getAllShiftsQueryKey,
      successMessage: successfullCreateMessage("Shift")
    }
  });
};
