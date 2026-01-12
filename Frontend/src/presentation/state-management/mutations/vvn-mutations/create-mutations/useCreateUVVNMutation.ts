import { useMutation } from "@tanstack/react-query";
import { CreateUnloadVVNUseCase } from "../../../../../application/vvn/VVNDI";
import type { UnloadVVNCreateDto } from "../../../../../infrastructure/dtos/vvn/unloadVVNCreateDto";
import { getAllSARVVNsQueryKey } from "../../../query-keys/sarVvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

export const useCreateUVVNMutation = () => {
  return useMutation({
    mutationFn: (dto: UnloadVVNCreateDto) => CreateUnloadVVNUseCase(dto),
    meta: {
      invalidatesQuery: [...getAllSARVVNsQueryKey],
      successMessage: successfullCreateMessage("Unload VVN"),
      errorMessage: "unload VVN"
    }
  });
};
