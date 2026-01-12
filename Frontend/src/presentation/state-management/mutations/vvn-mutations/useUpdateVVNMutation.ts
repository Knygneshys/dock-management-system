import { useMutation } from "@tanstack/react-query";

import type { VVNEditDto } from "../../../../infrastructure/dtos/vvn/vvnEditDto";
import { UpdateVVNUseCase } from "../../../../application/vvn/VVNDI";
import { getAllSARVVNsQueryKey } from "../../query-keys/sarVvnQueryKeys";
import { successfullUpdateMessage } from "../../../utils/toastMessageUtils";

interface Props {
  vvnUpdateDto: VVNEditDto;
  vvnCode: number;
}

export const useUpdateVVNMutation = () => {
  return useMutation({
    mutationFn: ({ vvnUpdateDto, vvnCode }: Props) => UpdateVVNUseCase(vvnUpdateDto, vvnCode),
    meta: {
      invalidatesQuery: [...getAllSARVVNsQueryKey],
      successMessage: successfullUpdateMessage("VVN"),
      errorMessage: "update VVN"
    }
  });
};
