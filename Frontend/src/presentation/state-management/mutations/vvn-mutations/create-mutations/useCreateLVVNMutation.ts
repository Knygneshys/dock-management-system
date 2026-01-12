import { useMutation } from "@tanstack/react-query";

import { CreateLoadVVNUseCase } from "../../../../../application/vvn/VVNDI";
import type { LoadVVNCreateDto } from "../../../../../infrastructure/dtos/vvn/loadVVNCreateDto";
import { getAllSARVVNsQueryKey } from "../../../query-keys/sarVvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

export const useCreateLVVNMutation = () => {
  return useMutation({
    mutationFn: (dto: LoadVVNCreateDto) => CreateLoadVVNUseCase(dto),
    meta: {
      invalidatesQuery: [...getAllSARVVNsQueryKey],
      successMessage: successfullCreateMessage("Load VVN"),
      errorMessage: "load VVN"
    }
  });
};
