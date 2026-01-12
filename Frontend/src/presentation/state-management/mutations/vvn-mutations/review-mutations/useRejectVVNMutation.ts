import { useMutation } from "@tanstack/react-query";

import type { VVNFeedbackDto } from "../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";
import { RejectVVNUseCase } from "../../../../../application/vvn/VVNDI";
import { getAllVVNsQueryKey } from "../../../query-keys/vvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

interface Props {
  feedback: VVNFeedbackDto;
  vvnCode: number;
}

export const useRejectVVNMutation = () => {
  return useMutation({
    mutationFn: ({ feedback, vvnCode }: Props) => RejectVVNUseCase(vvnCode, feedback),
    meta: {
      invalidatesQuery: [getAllVVNsQueryKey],
      successMessage: successfullCreateMessage("Feedback"),
      errorMessage: "feedback"
    }
  });
};
