import { useMutation } from "@tanstack/react-query";
import { CreateMaintenenceVVNUseCase } from "../../../../../application/vvn/VVNDI";
import type { VVNCreateDto } from "../../../../../infrastructure/dtos/vvn/vvnCreateDto";
import { getAllSARVVNsQueryKey } from "../../../query-keys/sarVvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

export const useCreateMVVNMutation = () => {
  return useMutation({
    mutationFn: (dto: VVNCreateDto) => CreateMaintenenceVVNUseCase(dto),
    meta: {
      invalidatesQuery: [...getAllSARVVNsQueryKey],
      successMessage: successfullCreateMessage("Maintenance VVN"),
      errorMessage: "maintenece VVN"
    }
  });
};
