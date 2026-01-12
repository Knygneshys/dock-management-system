import { useMutation } from "@tanstack/react-query";

import { AproveVVNUseCase } from "../../../../../application/vvn/VVNDI";
import type { VVNFeedbackDto } from "../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";
import { getAllVVNsQueryKey } from "../../../query-keys/vvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

interface Props {
  feedback: VVNFeedbackDto;
  vvnCode: number;
}

export const useAproveVVNMutation = () => {
  return useMutation({
    mutationFn: ({ feedback, vvnCode }: Props) => AproveVVNUseCase(vvnCode, feedback),
    meta: {
      invalidatesQuery: [getAllVVNsQueryKey],
      successMessage: successfullCreateMessage("Feedback"),
      errorMessage: "feedback"
    }
  });
};
