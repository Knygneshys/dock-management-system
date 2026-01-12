import { useMutation } from "@tanstack/react-query";
import { successfullCreateMessage } from "../../../utils/toastMessageUtils";
import { createOperationPlans } from "../../../../infrastructure/api/oem-clients/operationPlanApi";
import { DailyScheduleResponseDto } from "../../../../infrastructure/dtos/scheduling/DailyScheduleResponseDto";
import { AlgorithType } from "../../../../domain/Enums/algorithmTypes";

interface Params {
  schedulingDto: DailyScheduleResponseDto;
  algorithm: AlgorithType;
  userEmail: string;
  isRegenerated?: boolean;
}

export const useCreateOperationPlansMutation = () => {
  return useMutation({
    mutationFn: ({ schedulingDto, algorithm, userEmail, isRegenerated }: Params) => {
      return createOperationPlans(schedulingDto, algorithm, userEmail, isRegenerated);
    },
    meta: {
      successMessage: successfullCreateMessage("Operation Plans")
    }
  });
};
