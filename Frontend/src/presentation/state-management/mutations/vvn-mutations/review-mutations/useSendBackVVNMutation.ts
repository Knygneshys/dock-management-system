import { useMutation } from "@tanstack/react-query";

import type { VVNFeedbackDto } from "../../../../../infrastructure/dtos/vvn/vvnFeedbackDto";
import { SendBackVVNUseCase } from "../../../../../application/vvn/VVNDI";
import { getAllVVNsQueryKey } from "../../../query-keys/vvnQueryKeys";
import { successfullCreateMessage } from "../../../../utils/toastMessageUtils";

interface Props {
  feedback: VVNFeedbackDto;
  vvnCode: number;
}

export const useSendBackVVNMutation = () => {
  return useMutation({
    mutationFn: ({ feedback, vvnCode }: Props) => SendBackVVNUseCase(vvnCode, feedback),
    meta: {
      invalidatesQuery: [getAllVVNsQueryKey],
      successMessage: successfullCreateMessage("Feedback"),
      errorMessage: "feedback"
    }
  });
};
