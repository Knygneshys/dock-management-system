import { useMutation } from "@tanstack/react-query";
import { requestDataRectification } from "../../../../infrastructure/api/clients/userApi";

export const useRequestDataRectificationMutation = () => {
  return useMutation({
    mutationFn: requestDataRectification,
  });
};
