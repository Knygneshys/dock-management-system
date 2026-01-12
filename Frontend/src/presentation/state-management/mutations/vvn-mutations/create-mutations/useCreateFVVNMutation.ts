import { useMutation } from "@tanstack/react-query";

import { CreateFullVVNUseCase } from "../../../../../application/vvn/VVNDI";
import type { FullVVNCreateDto } from "../../../../../infrastructure/dtos/vvn/fullVVNCreateDto";
import { getAllSARVVNsQueryKey } from "../../../query-keys/sarVvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

export const useCreateFVVNMutation = () => {
  return useMutation({
    mutationFn: (dto: FullVVNCreateDto) => CreateFullVVNUseCase(dto),
    meta: {
      invalidatesQuery: [...getAllSARVVNsQueryKey],
      successMessage: successfullCreateMessage("Full VVN"),
      errorMessage: "full VVN"
    }
  });
};
